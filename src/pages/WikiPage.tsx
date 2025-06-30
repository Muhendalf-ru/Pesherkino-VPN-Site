import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/App.css';
import { wikiData } from '../data/wikiData';
import type { SearchResult } from '../types/WikiTypes';
import { LinkNotification, CopyLinkButton } from '../components/ui';
import { ReadingProgress, BottomNavigation } from '../components/features';
import { performSearch, highlightMatches, renderContentWithCodeBlocks } from '../utils/wikiUtils';

function WikiPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);
  const [showLinkNotification, setShowLinkNotification] = useState(false);

  // 1. Парсим параметры из URL
  const urlParams = new URLSearchParams(location.search);
  const sectionParam = urlParams.get('section');
  const subsectionParam = urlParams.get('subsection');

  // 2. Вычисляем текущий раздел и подраздел только из URL
  const currentSection = wikiData.find((section) => section.id === sectionParam) || wikiData[0];
  const subsections = currentSection.subsections || [];
  const activeSubsection =
    subsections.length > 0
      ? subsections.find((sub) => sub.id === subsectionParam) || subsections[0]
      : null;
  const selectedSection = currentSection.id;
  const activeSubsectionId = activeSubsection ? activeSubsection.id : null;

  // 3. currentVisibleSubsection — для прогресс-бара и подсветки (по умолчанию = activeSubsectionId)
  const [currentVisibleSubsection, setCurrentVisibleSubsection] = useState<string>(
    activeSubsectionId || '',
  );

  useEffect(() => {
    setCurrentVisibleSubsection(activeSubsectionId || '');
  }, [activeSubsectionId, selectedSection]);

  // 4. Observer только если есть подразделы
  useEffect(() => {
    if (!subsections.length) return;
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const subsectionId = entry.target.id;
          setCurrentVisibleSubsection(subsectionId);
          // Обновляем только если есть подразделы
          const params = new URLSearchParams();
          params.set('section', selectedSection);
          params.set('subsection', subsectionId);
          const newURL = `${location.pathname}?${params.toString()}`;
          if (location.search !== `?${params.toString()}`) {
            navigate(newURL, { replace: true });
          }
        }
      });
    }, observerOptions);
    subsections.forEach((subsection) => {
      const element = document.getElementById(subsection.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [selectedSection, subsections, navigate, location.pathname, location.search]);

  // 5. handleSectionClick/handleSubsectionClick — только navigate
  const handleSectionClick = (sectionId: string) => {
    const params = new URLSearchParams();
    params.set('section', sectionId);
    const newURL = `${location.pathname}?${params.toString()}`;
    navigate(newURL, { replace: true });
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };
  const handleSubsectionClick = (sectionId: string, subsectionId: string) => {
    const params = new URLSearchParams();
    params.set('section', sectionId);
    params.set('subsection', subsectionId);
    const newURL = `${location.pathname}?${params.toString()}`;
    navigate(newURL, { replace: true });
    setTimeout(() => {
      const element = document.getElementById(subsectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Обработка изменений поиска
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = performSearch(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
      setSelectedResultIndex(-1);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Обработка клика вне поиска
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Обработка клавиатуры для навигации по результатам
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
          handleResultClick(searchResults[selectedResultIndex]);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSearchQuery('');
        break;
    }
  };

  // Обработка клика по результату поиска
  const handleResultClick = (result: SearchResult) => {
    setCurrentVisibleSubsection(result.subsectionId || '');
    setSearchQuery('');
    setShowSearchResults(false);

    // Прокручиваем к подразделу если есть
    if (result.subsectionId) {
      setTimeout(() => {
        const element = document.getElementById(result.subsectionId!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Открытие модального поиска
  const openSearchModal = () => {
    setIsSearchModal(true);
    setShowSearchResults(true);
    setTimeout(() => {
      const input = document.getElementById('wiki-search-input');
      if (input) (input as HTMLInputElement).focus();
    }, 50);
  };
  // Закрытие модального поиска
  const closeSearchModal = () => {
    setIsSearchModal(false);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Escape закрывает модалку
  useEffect(() => {
    if (!isSearchModal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearchModal();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isSearchModal]);

  // Клик вне карточки — закрыть
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isSearchModal) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeSearchModal();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isSearchModal]);

  // Блокировка скролла при открытом мобильном меню
  useEffect(() => {
    if (isMobileSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebar]);

  // Клик вне меню — закрыть
  const mobileSidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isMobileSidebar) return;
    const handler = (e: MouseEvent) => {
      if (mobileSidebarRef.current && !mobileSidebarRef.current.contains(e.target as Node)) {
        setIsMobileSidebar(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMobileSidebar]);

  // Глобальный хоткей Ctrl+Shift+K (или Cmd+Shift+K для Mac) для открытия поиска
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const active = document.activeElement;
      const isInput =
        active &&
        ((active.tagName === 'INPUT' &&
          (active as HTMLInputElement).type !== 'checkbox' &&
          (active as HTMLInputElement).type !== 'radio') ||
          active.tagName === 'TEXTAREA' ||
          (active as HTMLElement).isContentEditable);
      if (!isInput && (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
    };
    document.addEventListener('keydown', handler, true); // capture phase
    return () => document.removeEventListener('keydown', handler, true);
  }, []);

  return (
    <div className="wiki-container">
      {/* Уведомления */}
      <LinkNotification isVisible={showLinkNotification} />

      {/* Header */}
      <motion.header
        className="wiki-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className="wiki-header-content">
          {/* Гамбургер для мобильного */}
          <button
            className="sidebar-toggle"
            onClick={() => setIsMobileSidebar(true)}
            title="sidebar"
            style={{ display: 'none' }}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="wiki-title">
            <h1>
              <span
                style={{
                  fontSize: '1.8rem',
                  background: 'none',
                  WebkitBackgroundClip: 'initial',
                  WebkitTextFillColor: 'initial',
                  backgroundClip: 'initial',
                  color: 'inherit',
                }}>
                📚
              </span>{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                Pesherkino Wiki
              </span>
            </h1>
            <p>Полное руководство по использованию</p>
          </div>

          {/* Поиск в header для ПК (только справа от лого) */}
          <div className="header-search-desktop">
            <div className="search-input-wrapper" style={{ position: 'relative' }}>
              <svg
                className="search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  position: 'absolute',
                  zIndex: 2,
                }}>
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Поиск по Wiki..."
                onFocus={openSearchModal}
                readOnly
                style={{
                  cursor: 'pointer',
                  background: 'rgba(30,41,59,0.7)',
                  paddingLeft: 44,
                  paddingRight: 80,
                  minWidth: 220,
                }}
              />
              <span className="search-hotkey-hint">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+K
              </span>
            </div>
          </div>

          <motion.button
            className="back-button"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            На главную
          </motion.button>
        </div>
      </motion.header>

      {/* Модальный поиск GitBook-стиля */}
      <AnimatePresence>
        {isSearchModal && (
          <motion.div
            className="search-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="search-modal-card"
              ref={modalRef}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.18 }}>
              <div className="search-modal-header">
                <div
                  className="search-input-wrapper"
                  style={{ position: 'relative', width: '100%' }}>
                  <svg
                    className="search-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                    }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    id="wiki-search-input"
                    type="text"
                    className="search-input"
                    placeholder="Поиск по Wiki... (Ctrl+Shift+K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    style={{ paddingLeft: 44, paddingRight: 44 }}
                  />
                  {searchQuery && (
                    <button
                      className="search-clear"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }}
                      style={{
                        position: 'absolute',
                        right: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                      }}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <div className="search-modal-results">
                {searchQuery && searchResults.length === 0 && (
                  <div className="search-modal-noresults">
                    Ничего не найдено по запросу "{searchQuery}"
                  </div>
                )}
                {searchResults.map((result, index) => (
                  <motion.div
                    key={`${result.sectionId}-${result.subsectionId || 'main'}-${index}`}
                    className={`search-result-item${
                      index === selectedResultIndex ? ' selected' : ''
                    }`}
                    onClick={() => handleResultClick(result)}
                    whileHover={{ backgroundColor: 'rgba(59,130,246,0.07)' }}>
                    <div className="search-section-title">{result.sectionTitle}</div>
                    {result.type !== 'section' && (
                      <div className="search-subtitle">
                        {result.type === 'subsection'
                          ? result.subsectionTitle
                          : result.context.split('>')[1]?.trim()}
                      </div>
                    )}
                    <div className="search-context">
                      {highlightMatches(result.context, searchQuery)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMobileSidebar && (
          <motion.div
            className="mobile-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.aside
              className="mobile-sidebar"
              ref={mobileSidebarRef}
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.22 }}>
              <button
                className="mobile-sidebar-close"
                onClick={() => setIsMobileSidebar(false)}
                title="Закрыть меню">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="sidebar-content">
                <div className="search-container">
                  <div className="search-input-wrapper" style={{ position: 'relative' }}>
                    <svg
                      className="search-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Поиск по Wiki..."
                      onFocus={openSearchModal}
                      readOnly
                      style={{
                        cursor: 'pointer',
                        background: 'rgba(30,41,59,0.7)',
                        paddingRight: 80,
                      }}
                    />
                    <span className="search-hotkey-hint">
                      {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+K
                    </span>
                  </div>
                </div>
                <nav className="wiki-navigation">
                  <ul className="nav-list">
                    {wikiData.map((section) => (
                      <li key={section.id} className="nav-item">
                        <button
                          className={`nav-link ${selectedSection === section.id ? 'active' : ''}`}
                          onClick={() => {
                            handleSectionClick(section.id);
                            setIsMobileSidebar(false);
                          }}>
                          <span className="nav-link-text">{section.title}</span>
                        </button>
                        {section.subsections && (
                          <ul className="subnav-list">
                            {section.subsections.map((subsection) => (
                              <li key={subsection.id} className="subnav-item">
                                <div className="subnav-link-container">
                                  <button
                                    className={`subnav-link ${
                                      currentVisibleSubsection === subsection.id ? 'active' : ''
                                    }`}
                                    onClick={() =>
                                      handleSubsectionClick(section.id, subsection.id)
                                    }>
                                    {subsection.title}
                                  </button>
                                  <CopyLinkButton
                                    onClick={() => {
                                      const params = new URLSearchParams();
                                      params.set('section', section.id);
                                      params.set('subsection', subsection.id);
                                      const subsectionURL = `${window.location.origin}${
                                        location.pathname
                                      }?${params.toString()}`;
                                      navigator.clipboard.writeText(subsectionURL);
                                      setShowLinkNotification(true);
                                      setTimeout(() => setShowLinkNotification(false), 2000);
                                    }}
                                    title="Копировать ссылку на подраздел"
                                  />
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="wiki-content-wrapper">
        {/* Sidebar для desktop */}
        <AnimatePresence>
          {isSidebarOpen && !isSearchModal && (
            <motion.aside
              className="wiki-sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <div className="sidebar-content">
                {/* Навигация */}
                <nav className="wiki-navigation">
                  <ul className="nav-list">
                    {wikiData.map((section) => (
                      <li key={section.id} className="nav-item">
                        <div className="nav-link-container">
                          <button
                            className={`nav-link ${selectedSection === section.id ? 'active' : ''}`}
                            onClick={() => handleSectionClick(section.id)}>
                            <span className="nav-link-text">{section.title}</span>
                          </button>
                          <CopyLinkButton
                            onClick={() => {
                              const params = new URLSearchParams();
                              params.set('section', section.id);
                              const sectionURL = `${window.location.origin}${
                                location.pathname
                              }?${params.toString()}`;
                              navigator.clipboard.writeText(sectionURL);
                              setShowLinkNotification(true);
                              setTimeout(() => setShowLinkNotification(false), 2000);
                            }}
                            title="Копировать ссылку на раздел"
                          />
                        </div>
                        {section.subsections && (
                          <ul className="subnav-list">
                            {section.subsections.map((subsection) => (
                              <li key={subsection.id} className="subnav-item">
                                <div className="subnav-link-container">
                                  <button
                                    className={`subnav-link ${
                                      subsections.length > 0 && activeSubsectionId === subsection.id
                                        ? 'active'
                                        : ''
                                    }`}
                                    onClick={() =>
                                      handleSubsectionClick(section.id, subsection.id)
                                    }>
                                    {subsection.title}
                                  </button>
                                  <CopyLinkButton
                                    onClick={() => {
                                      const params = new URLSearchParams();
                                      params.set('section', section.id);
                                      params.set('subsection', subsection.id);
                                      const subsectionURL = `${window.location.origin}${
                                        location.pathname
                                      }?${params.toString()}`;
                                      navigator.clipboard.writeText(subsectionURL);
                                      setShowLinkNotification(true);
                                      setTimeout(() => setShowLinkNotification(false), 2000);
                                    }}
                                    title="Копировать ссылку на подраздел"
                                  />
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="wiki-main">
          {/* Индикатор прогресса чтения */}
          {subsections.length > 0 && (
            <ReadingProgress
              currentSubsection={activeSubsectionId || ''}
              totalSubsections={subsections.length}
              subsections={subsections}
            />
          )}

          <motion.div
            className="wiki-content"
            key={selectedSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            {renderContentWithCodeBlocks(currentSection.content)}

            {activeSubsection && (
              <div className="subsections">
                <div key={activeSubsection.id} id={activeSubsection.id} className="subsection">
                  {renderContentWithCodeBlocks(activeSubsection.content)}
                </div>
              </div>
            )}

            {/* Навигация внизу страницы */}
            <BottomNavigation
              currentSection={currentSection}
              currentSubsection={activeSubsection}
              onNavigate={(sectionId, subsectionId) => {
                if (subsectionId) {
                  handleSubsectionClick(sectionId, subsectionId);
                } else {
                  handleSectionClick(sectionId);
                }
              }}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default WikiPage;
