import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { wikiData } from './wikiData';
import type { SearchResult, WikiSection } from './wikiData';

// Компонент уведомления о копировании
const CopyNotification = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="copy-notification"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}>
          <div className="copy-notification-content">
            <svg
              className="copy-notification-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            <span>Код скопирован!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Компонент уведомления о копировании ссылки
const LinkNotification = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="link-notification"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}>
          <div className="link-notification-content">
            <svg
              className="link-notification-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span>Ссылка скопирована!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Компонент кнопки копирования ссылки
const CopyLinkButton = ({ onClick, title }: { onClick: () => void; title: string }) => {
  return (
    <button className="copy-link-button" onClick={onClick} title={title}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    </button>
  );
};

// Компонент индикатора прогресса чтения
const ReadingProgress = ({
  currentSubsection,
  totalSubsections,
  subsections,
}: {
  currentSubsection: string;
  totalSubsections: number;
  subsections: WikiSection[];
}) => {
  if (totalSubsections === 0) return null;

  const currentIndex = subsections.findIndex((sub: WikiSection) => sub.id === currentSubsection);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / totalSubsections) * 100 : 0;

  return (
    <div className="reading-progress">
      <div className="reading-progress-bar">
        <div className="reading-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="reading-progress-text">
        {currentIndex >= 0 ? currentIndex + 1 : 0} из {totalSubsections}
      </div>
    </div>
  );
};

const CodeBlock = ({ children }: { children: string }) => {
  const [copied, setCopied] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setShowNotification(true);

      // Скрываем уведомление через 2 секунды
      setTimeout(() => {
        setShowNotification(false);
        setTimeout(() => setCopied(false), 300); // Скрываем состояние кнопки после анимации
      }, 2000);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  return (
    <div className="code-block">
      <CopyNotification isVisible={showNotification} />
      <button className={`code-copy-button ${copied ? 'copied' : ''}`} onClick={handleCopy}>
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            Скопировано
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Копировать
          </>
        )}
      </button>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
};

// Функция для рендеринга HTML с поддержкой блоков кода
const renderContentWithCodeBlocks = (htmlContent: string) => {
  // Находим все блоки кода и заменяем их на компоненты
  const codeBlockRegex =
    /<div class="code-block">\s*<pre><code>([\s\S]*?)<\/code><\/pre>\s*<\/div>/g;

  // Проверяем, есть ли блоки кода в контенте
  const hasCodeBlocks = codeBlockRegex.test(htmlContent);
  console.log('Has code blocks:', hasCodeBlocks);

  if (!hasCodeBlocks) {
    // Если блоков кода нет, просто возвращаем обычный HTML
    return <div className="content-html" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }

  // Сбрасываем регулярное выражение
  codeBlockRegex.lastIndex = 0;

  const parts = htmlContent.split(codeBlockRegex);
  const result = [];

  console.log('Parts length:', parts.length);

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // Обычный HTML контент
      if (parts[i].trim()) {
        result.push(
          <div
            key={`html-${i}`}
            className="content-html"
            dangerouslySetInnerHTML={{ __html: parts[i] }}
          />,
        );
      }
    } else {
      // Блок кода
      console.log('Code block found:', parts[i].substring(0, 100) + '...');
      result.push(<CodeBlock key={`code-${i}`}>{parts[i]}</CodeBlock>);
    }
  }

  return result;
};

// Компонент навигации внизу страницы
const BottomNavigation = ({
  currentSection,
  currentSubsection,
  onNavigate,
}: {
  currentSection: WikiSection;
  currentSubsection: WikiSection | null;
  onNavigate: (sectionId: string, subsectionId?: string) => void;
}) => {
  // Получаем все разделы и подразделы в плоском списке для навигации
  const getAllItems = () => {
    const items: Array<{
      type: 'section' | 'subsection';
      section: WikiSection;
      subsection?: WikiSection;
    }> = [];

    wikiData.forEach((section) => {
      // Добавляем раздел
      items.push({ type: 'section', section });

      // Добавляем подразделы раздела
      if (section.subsections) {
        section.subsections.forEach((subsection) => {
          items.push({ type: 'subsection', section, subsection });
        });
      }
    });

    return items;
  };

  const allItems = getAllItems();
  const currentIndex = allItems.findIndex((item) => {
    if (currentSubsection) {
      return (
        item.type === 'subsection' &&
        item.section.id === currentSection.id &&
        item.subsection?.id === currentSubsection.id
      );
    } else {
      return item.type === 'section' && item.section.id === currentSection.id;
    }
  });

  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const handlePrevClick = () => {
    if (prevItem) {
      if (prevItem.type === 'subsection' && prevItem.subsection) {
        onNavigate(prevItem.section.id, prevItem.subsection.id);
      } else {
        onNavigate(prevItem.section.id);
      }
    }
  };

  const handleNextClick = () => {
    if (nextItem) {
      if (nextItem.type === 'subsection' && nextItem.subsection) {
        onNavigate(nextItem.section.id, nextItem.subsection.id);
      } else {
        onNavigate(nextItem.section.id);
      }
    }
  };

  if (!prevItem && !nextItem) return null;

  return (
    <div className="bottom-navigation">
      <div className="bottom-navigation-container">
        {prevItem && (
          <motion.button
            className="nav-button nav-button-prev"
            onClick={handlePrevClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="nav-button-content">
              <div className="nav-button-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </div>
              <div className="nav-button-text">
                <div className="nav-button-label">Назад</div>
                <div className="nav-button-title">
                  {prevItem.type === 'subsection' && prevItem.subsection
                    ? `${prevItem.section.title} > ${prevItem.subsection.title}`
                    : prevItem.section.title}
                </div>
              </div>
            </div>
          </motion.button>
        )}

        {nextItem && (
          <motion.button
            className="nav-button nav-button-next"
            onClick={handleNextClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="nav-button-content">
              <div className="nav-button-text">
                <div className="nav-button-label">Вперед</div>
                <div className="nav-button-title">
                  {nextItem.type === 'subsection' && nextItem.subsection
                    ? `${nextItem.section.title} > ${nextItem.subsection.title}`
                    : nextItem.section.title}
                </div>
              </div>
              <div className="nav-button-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </div>
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
};

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

  // Функция поиска в стиле GitBook
  const performSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    wikiData.forEach((section) => {
      // Поиск в заголовке раздела
      if (section.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          sectionId: section.id,
          sectionTitle: section.title,
          matchedText: section.title,
          context: section.title,
          type: 'section',
        });
      }

      // Поиск в подразделах
      if (section.subsections) {
        section.subsections.forEach((subsection) => {
          if (subsection.title.toLowerCase().includes(lowerQuery)) {
            results.push({
              sectionId: section.id,
              sectionTitle: section.title,
              subsectionId: subsection.id,
              subsectionTitle: subsection.title,
              matchedText: subsection.title,
              context: `${section.title} > ${subsection.title}`,
              type: 'subsection',
            });
          }

          // Поиск в содержимом подраздела
          const contentMatch = findContentMatches(subsection.content, lowerQuery);
          contentMatch.forEach((match) => {
            results.push({
              sectionId: section.id,
              sectionTitle: section.title,
              subsectionId: subsection.id,
              subsectionTitle: subsection.title,
              matchedText: match.text,
              context: match.context,
              type: 'content',
            });
          });
        });
      }

      // Поиск в содержимом раздела
      const contentMatch = findContentMatches(section.content, lowerQuery);
      contentMatch.forEach((match) => {
        results.push({
          sectionId: section.id,
          sectionTitle: section.title,
          matchedText: match.text,
          context: match.context,
          type: 'content',
        });
      });
    });

    return results.slice(0, 10); // Ограничиваем 10 результатами
  };

  // Функция поиска совпадений в HTML-контенте
  const findContentMatches = (
    htmlContent: string,
    query: string,
  ): Array<{ text: string; context: string }> => {
    const matches: Array<{ text: string; context: string }> = [];

    // Убираем HTML-теги для поиска
    const textContent = htmlContent.replace(/<[^>]*>/g, ' ');
    const sentences = textContent.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    sentences.forEach((sentence) => {
      const lowerSentence = sentence.toLowerCase();
      if (lowerSentence.includes(query)) {
        const startIndex = lowerSentence.indexOf(query);
        const endIndex = startIndex + query.length;

        // Получаем контекст вокруг совпадения
        const contextStart = Math.max(0, startIndex - 50);
        const contextEnd = Math.min(sentence.length, endIndex + 50);
        let context = sentence.substring(contextStart, contextEnd);

        // Добавляем многоточие если обрезали
        if (contextStart > 0) context = '...' + context;
        if (contextEnd < sentence.length) context = context + '...';

        // Выделяем совпадающий текст
        const matchStart = startIndex - contextStart;
        const matchEnd = endIndex - contextStart;
        const matchedText = context.substring(matchStart, matchEnd);

        matches.push({
          text: matchedText,
          context: context,
        });
      }
    });

    return matches;
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

  // Подсветка совпадений в тексте
  const highlightMatches = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          style={{
            background: '#3b82f6',
            color: '#fff',
            borderRadius: '4px',
            padding: '0 5px',
            fontWeight: 500,
            boxShadow: 'none',
          }}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
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
