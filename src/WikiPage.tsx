import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

interface WikiSection {
  id: string;
  title: string;
  content: string;
  subsections?: WikiSection[];
}

interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  subsectionId?: string;
  subsectionTitle?: string;
  matchedText: string;
  context: string;
  type: 'section' | 'subsection' | 'content';
}

const wikiData: WikiSection[] = [
  {
    id: 'install',
    title: 'Установка',
    content: `<h2>Установка Pesherkino VPN</h2>
      <p>Выберите вашу платформу и следуйте инструкции:</p>`,
    subsections: [
      {
        id: 'install-windows',
        title: 'Windows | Hiddify',
        content: `<h3>Установка на Windows через Hiddify</h3>
        <ol>
          <li>Скачайте <a href="https://hiddify.com/ru/download" target="_blank">Hiddify</a> с официального сайта.</li>
          <li>Импортируйте ссылку из Telegram-бота.</li>
          <li>Следуйте инструкции по подключению.</li>
        </ol>`,
      },
      {
        id: 'install-macos',
        title: 'MacOS | Hiddify',
        content: `<h3>Установка на MacOS через Hiddify</h3>
        <ol>
          <li>Скачайте Hiddify для MacOS.</li>
          <li>Импортируйте ссылку из Telegram-бота.</li>
          <li>Следуйте инструкции по подключению.</li>
        </ol>`,
      },
      {
        id: 'install-iphone',
        title: 'Iphone | Streisand',
        content: `<h3>Установка на iPhone через Streisand</h3>
        <ol>
          <li>Скачайте Streisand из App Store.</li>
          <li>Импортируйте ссылку из Telegram-бота.</li>
          <li>Следуйте инструкции по подключению.</li>
        </ol>`,
      },
      {
        id: 'install-android',
        title: 'Android Hiddify',
        content: `<h3>Установка на Android через Hiddify</h3>
        <ol>
          <li>Скачайте Hiddify из Google Play.</li>
          <li>Импортируйте ссылку из Telegram-бота.</li>
          <li>Следуйте инструкции по подключению.</li>
        </ol>`,
      },
    ],
  },
  {
    id: 'advanced-windows',
    title: 'Более сложная установка на Windows',
    content: `<h2>Более сложная установка на Windows</h2>
      <p>Инструкции для продвинутых пользователей и особых сценариев:</p>`,
    subsections: [
      {
        id: 'advanced-history',
        title: 'Предыстория',
        content: `<h3>Предыстория</h3>
        <p>Почему стоит выбрать альтернативные клиенты и когда это нужно.</p>`,
      },
      {
        id: 'nekoray-windows',
        title: 'Nekoray - Windows',
        content: `<h3>Nekoray - Windows</h3>
        <p>Подробная инструкция по установке и настройке Nekoray для Windows.</p>`,
      },
      {
        id: 'nekoray-split',
        title: 'Nekoray - Windows | Раздельный трафик',
        content: `<h3>Nekoray - Windows | Раздельный трафик</h3>
        <p>Как настроить раздельный трафик для разных приложений.</p>`,
      },
      {
        id: 'nekoray-browser-discord',
        title: 'Nekoray - Windows | только браузер и discord',
        content: `<h3>Nekoray - Windows | только браузер и discord</h3>
        <p>Настройка VPN только для браузера и Discord.</p>`,
      },
    ],
  },
  {
    id: 'locations',
    title: 'Локации серверов',
    content: `
      <h2>Наши серверы</h2>
      <p>Pesherkino VPN имеет серверы в различных странах для обеспечения оптимальной скорости и доступа к различным ресурсам.</p>
      <div class="locations-grid">
        <div class="location-card-wiki">
          <img src="/sweden.svg" alt="Швеция" class="location-flag-wiki" />
          <h3>Стокгольм, Швеция</h3>
          <p>Оптимально для доступа к европейским сервисам: Spotify, IKEA, Klarna</p>
          <div class="ping-info">Средний пинг: 45-65ms</div>
        </div>
        <div class="location-card-wiki">
          <img src="/germany.svg" alt="Германия" class="location-flag-wiki" />
          <h3>Франкфурт, Германия</h3>
          <p>Идеально для Discord и немецких сервисов: Deutsche Bank, Commerzbank</p>
          <div class="ping-info">Средний пинг: 35-55ms</div>
        </div>
        <div class="location-card-wiki">
          <img src="/netherlands.svg" alt="Нидерланды" class="location-flag-wiki" />
          <h3>Амстердам, Нидерланды</h3>
          <p>Отлично для голландских сервисов: Philips, KLM, TomTom</p>
          <div class="ping-info">Средний пинг: 40-60ms</div>
        </div>
        <div class="location-card-wiki">
          <img src="/russia.svg" alt="Россия" class="location-flag-wiki" />
          <h3>Санкт-Петербург, Россия</h3>
          <p>Для доступа к российским сервисам: HeadHunter, Rutube, Циан</p>
          <div class="ping-info">Средний пинг: 15-35ms</div>
        </div>
      </div>
    `,
  },
  {
    id: 'faq-extended',
    title: 'Часто задаваемые вопросы',
    content: `
      <h2>FAQ</h2>
      <div class="faq-item">
        <h3>🔒 Безопасен ли Pesherkino VPN?</h3>
        <p>Да, наш сервис полностью безопасен. Мы используем современные протоколы шифрования и не ведем логи активности пользователей. Весь код открыт и доступен для проверки.</p>
      </div>
      <div class="faq-item">
        <h3>⚡ Какова скорость соединения?</h3>
        <p>Скорость зависит от выбранного сервера и качества вашего интернет-соединения. В среднем потери скорости составляют 5-15%.</p>
      </div>
      <div class="faq-item">
        <h3>💬 Почему Discord Fix бесплатный?</h3>
        <p>Мы считаем, что доступ к Discord должен быть свободным. Discord Fix — это наш вклад в сообщество геймеров и разработчиков.</p>
      </div>
      <div class="faq-item">
        <h3>🛡️ Что означает "Open Source"?</h3>
        <p>Весь исходный код нашего приложения открыт и доступен на GitHub. Это означает максимальную прозрачность и возможность независимой проверки безопасности.</p>
      </div>
      <div class="faq-item">
        <h3>🤝 Как работает реферальная система?</h3>
        <p>За каждого приглашенного пользователя вы получаете 10% от суммы его первого платежа в качестве бонуса на ваш счет.</p>
      </div>
      <div class="faq-item">
        <h3>📱 Поддерживаются ли мобильные устройства?</h3>
        <p>В настоящее время мы поддерживаем Windows и расширения для браузеров. Мобильные приложения находятся в разработке.</p>
      </div>
    `,
  },
  {
    id: 'troubleshooting',
    title: 'Проблемы и решения',
    content: `
      <h2>Проблемы и решения</h2>
      <ul>
        <li><b>Общие советы:</b> Что делать, если не удаётся подключиться или скорость низкая.</li>
        <li><b>Discord не работает:</b> Проверьте, что вы используете Discord Fix и отключили другие VPN.</li>
        <li><b>Проблемы с оплатой:</b> Попробуйте другой способ или обратитесь в поддержку.</li>
      </ul>
    `,
    subsections: [
      {
        id: 'troubleshooting-tips',
        title: 'Общие советы',
        content: `
          <h3>Что делать, если возникли проблемы?</h3>
          <ul>
            <li>Перезапустите приложение и устройство.</li>
            <li>Проверьте интернет-соединение.</li>
            <li>Попробуйте другой сервер или локацию.</li>
            <li>Отключите сторонние VPN и прокси.</li>
            <li>Обратитесь в поддержку через Telegram-бота.</li>
          </ul>
        `,
      },
    ],
  },
  {
    id: 'useful',
    title: 'Полезное',
    content: `
      <h2>Полезные материалы</h2>
      <ul>
        <li><b>Выбор клиента:</b> Какой VPN-клиент выбрать для вашей платформы.</li>
        <li><b>Сравнение тарифов:</b> Какой тариф подойдёт именно вам.</li>
        <li><b>Ссылки на официальные ресурсы и чаты.</b></li>
      </ul>
    `,
    subsections: [
      {
        id: 'choose-client',
        title: 'Выбор клиента',
        content: `
          <h3>Как выбрать VPN-клиент?</h3>
          <ul>
            <li>Для Windows и Android рекомендуем Hiddify.</li>
            <li>Для MacOS — Hiddify или Streisand.</li>
            <li>Для iOS — Streisand.</li>
            <li>Для Linux — любой клиент с поддержкой VLESS/VMess.</li>
          </ul>
        `,
      },
    ],
  },
];

function WikiPage() {
  const [selectedSection, setSelectedSection] = useState<string>('getting-started');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);

  const currentSection = wikiData.find((section) => section.id === selectedSection) || wikiData[0];

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
    setSelectedSection(result.sectionId);
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

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSubsectionClick = (sectionId: string, subsectionId: string) => {
    setSelectedSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(subsectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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
                            setSelectedSection(section.id);
                            setIsMobileSidebar(false);
                          }}>
                          <span className="nav-link-text">{section.title}</span>
                        </button>
                        {section.subsections && (
                          <ul className="subnav-list">
                            {section.subsections.map((subsection) => (
                              <li key={subsection.id} className="subnav-item">
                                <button
                                  className="subnav-link"
                                  onClick={() => {
                                    setSelectedSection(section.id);
                                    setTimeout(() => {
                                      const el = document.getElementById(subsection.id);
                                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                    setIsMobileSidebar(false);
                                  }}>
                                  {subsection.title}
                                </button>
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
                        <button
                          className={`nav-link ${selectedSection === section.id ? 'active' : ''}`}
                          onClick={() => handleSectionClick(section.id)}>
                          <span className="nav-link-text">{section.title}</span>
                        </button>
                        {section.subsections && (
                          <ul className="subnav-list">
                            {section.subsections.map((subsection) => (
                              <li key={subsection.id} className="subnav-item">
                                <button
                                  className="subnav-link"
                                  onClick={() => handleSubsectionClick(section.id, subsection.id)}>
                                  {subsection.title}
                                </button>
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
          <motion.div
            className="wiki-content"
            key={selectedSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <div
              className="content-html"
              dangerouslySetInnerHTML={{ __html: currentSection.content }}
            />

            {currentSection.subsections && (
              <div className="subsections">
                {currentSection.subsections.map((subsection) => (
                  <div key={subsection.id} id={subsection.id} className="subsection">
                    <div
                      className="content-html"
                      dangerouslySetInnerHTML={{ __html: subsection.content }}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default WikiPage;
