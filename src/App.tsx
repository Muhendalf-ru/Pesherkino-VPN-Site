import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showBrowsers, setShowBrowsers] = useState(false);
  const [showDiscordInstructions, setShowDiscordInstructions] = useState(false);
  const [locations, setLocations] = useState([
    {
      name: 'Стокгольм',
      ping: '...',
      flag: '/sweden.svg',
      hosts: [
        'https://api.spotify.com/v1/health', // Spotify API
        'https://api.ikea.com/health', // IKEA API
        'https://api.klarna.com/health', // Klarna API
      ],
    },
    {
      name: 'Франкфурт',
      ping: '...',
      flag: '/germany.svg',
      hosts: [
        'https://api.db.com/health', // Deutsche Bank API
        'https://api.commerzbank.de/health', // Commerzbank API
        'https://api.frankfurt-airport.com/health', // Frankfurt Airport API
      ],
    },
    {
      name: 'Нидерланды',
      ping: '...',
      flag: '/netherlands.svg',
      hosts: [
        'https://api.philips.com/health', // Philips API
        'https://api.klm.com/health', // KLM API
        'https://api.tomtom.com/health', // TomTom API
      ],
    },
    {
      name: 'Санкт-Петербург',
      ping: '...',
      flag: '/russia.svg',
      hosts: [
        'https://spb.hh.ru', // HeadHunter СПб
        'https://spb.rutube.ru', // Rutube СПб
        'https://spb.cian.ru', // Циан СПб
      ],
    },
  ]);

  const measurePing = async (hosts: string[]) => {
    const pings: number[] = [];

    for (const host of hosts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // Таймаут 2 секунды

        const startTime = performance.now();
        await fetch(host, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal,
          headers: {
            Accept: '*/*',
            Connection: 'keep-alive',
          },
        });
        const endTime = performance.now();
        clearTimeout(timeoutId);

        // Вычитаем время на DNS-запрос и обработку ответа
        const ping = Math.round(endTime - startTime - 50); // Примерное время на обработку
        if (ping > 0) pings.push(ping);
      } catch {
        continue;
      }
    }

    if (pings.length === 0) return '∞';

    // Возвращаем минимальное значение пинга
    return Math.min(...pings);
  };

  useEffect(() => {
    const updatePings = async () => {
      const updatedLocations = await Promise.all(
        locations.map(async (location) => {
          const ping = await measurePing(location.hosts);
          return { ...location, ping: typeof ping === 'number' ? `${ping}ms` : ping };
        }),
      );
      setLocations(updatedLocations);
    };

    updatePings();
    const interval = setInterval(updatePings, 60000); // Обновляем каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  const browsers = [
    {
      name: 'Firefox',
      icon: '/firefox.svg',
      url: 'https://addons.mozilla.org/firefox/addon/pesherkino-vpn/',
    },
    {
      name: 'Yandex',
      icon: '/yandex.svg',
      url: 'https://addons.opera.com/extensions/details/pesherkino-vpn/',
    },
    {
      name: 'Chrome',
      icon: '/chrome.svg',
      url: 'https://chrome.google.com/webstore/detail/pesherkino-vpn/',
    },
    {
      name: 'Edge',
      icon: '/edge.svg',
      url: 'https://microsoftedge.microsoft.com/addons/detail/pesherkino-vpn/',
    },
  ];

  const footerLinks = [
    { name: 'Github', icon: '⚡', url: 'https://github.com/Muhendalf-ru/pesherkino-vpn' },
    { name: 'Wiki', icon: '📚', url: 'https://pesherkino-vpn.gitbook.io/pesherkino-vpn' },
    { name: 'Купить VPN', icon: '💎', url: 'https://t.me/pesherkino_bot?start=ref_855347094' },
    { name: 'Поддержка', icon: '🛟', url: 'https://t.me/pesherkino' },
  ];

  return (
    <div className="app-container">
      <div className="animated-background" />
      <div className="space-elements">
        <div className="comet" />
        <img src="/neptune.svg" alt="Neptune" className="planet planet-neptune" />
        <img src="/planet.svg" alt="Planet 1" className="planet planet-1" />
        <img src="/planet.svg" alt="Planet 2" className="planet planet-2" />
        <img src="/planet.svg" alt="Planet 3" className="planet planet-3" />

        {/* Звезды */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`star star-${['small', 'medium', 'large'][Math.floor(Math.random() * 3)]}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              ['--duration' as string]: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Туманности */}
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
      </div>
      <div className="content">
        <div className="main-content">
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{
              scale: 1.05,
              textShadow: '0 0 8px rgba(255,255,255,0.5)',
              transition: { duration: 0.3 },
            }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="gradient-text">
              Pesherkino VPN
            </motion.span>
          </motion.h1>

          <motion.div
            className="discord-offer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            <div
              className="discord-content"
              onMouseEnter={() => setShowDiscordInstructions(true)}
              onMouseLeave={() => setShowDiscordInstructions(false)}>
              <span className="discord-text">
                Мы починим ваш Discord <strong>бесплатно</strong>
              </span>
              <span className="heart-icon">❤️</span>
              <AnimatePresence>
                {showDiscordInstructions && (
                  <motion.div
                    className="discord-instructions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}>
                    <ol>
                      <li>Скачать наше приложение</li>
                      <li>
                        Иметь скаченный <span className="highlight">Discord</span>
                      </li>
                      <li>
                        Выключить все сторонние <span className="highlight">VPN</span> сервисы и{' '}
                        <span className="highlight">GoodByeDPI</span>
                      </li>
                      <li>
                        Подключиться во вкладке <span className="highlight">Discord Fix</span>
                      </li>
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="button-container">
            <motion.button
              className="download-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Доступно для Windows 10 и 11"
              onClick={() =>
                window.open(
                  'https://github.com/Muhendalf-ru/pesherkino-vpn/releases/download/v2.0.38/pesherkino-vpn-2.0.38-setup.exe',
                  '_blank',
                )
              }>
              <svg
                className="windows-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="24"
                height="24">
                <path
                  d="M 44.970703 4 A 1.0001 1.0001 0 0 0 44.851562 4.0117188 L 23.851562 7.1601562 A 1.0001 1.0001 0 0 0 23 8.1503906 L 23 23 A 1.0001 1.0001 0 0 0 24 24 L 45 24 A 1.0001 1.0001 0 0 0 46 23 L 46 5 A 1.0001 1.0001 0 0 0 44.970703 4 z M 44 6.1601562 L 44 22 L 25 22 L 25 9.0117188 L 44 6.1601562 z M 19.970703 7.75 A 1.0001 1.0001 0 0 0 19.851562 7.7617188 L 4.8515625 10.011719 A 1.0001 1.0001 0 0 0 4 11 L 4 23 A 1.0001 1.0001 0 0 0 5 24 L 20 24 A 1.0001 1.0001 0 0 0 21 23 L 21 8.75 A 1.0001 1.0001 0 0 0 19.970703 7.75 z M 19 9.9101562 L 19 22 L 6 22 L 6 11.861328 L 19 9.9101562 z M 5 26 A 1.0001 1.0001 0 0 0 4 27 L 4 39 A 1.0001 1.0001 0 0 0 4.8515625 39.988281 L 19.851562 42.238281 A 1.0001 1.0001 0 0 0 21 41.25 L 21 27 A 1.0001 1.0001 0 0 0 20 26 L 5 26 z M 24 26 A 1.0001 1.0001 0 0 0 23 27 L 23 41.849609 A 1.0001 1.0001 0 0 0 23.851562 42.839844 L 44.851562 45.988281 A 1.0001 1.0001 0 0 0 46 45 L 46 27 A 1.0001 1.0001 0 0 0 45 26 L 24 26 z M 6 28 L 19 28 L 19 40.089844 L 6 38.138672 L 6 28 z M 25 28 L 44 28 L 44 43.839844 L 25 40.988281 L 25 28 z"
                  fill="currentColor"
                />
              </svg>
              Скачать приложение
            </motion.button>
            <div className="browser-button-wrapper">
              <motion.button
                className="download-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBrowsers(!showBrowsers)}>
                Скачать расширение браузера
              </motion.button>
              <motion.button
                className="buy-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  window.open('https://t.me/pesherkino_bot?start=ref_855347094', '_blank')
                }>
                <span>Купить VPN</span>
                <svg
                  className="telegram-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50">
                  <path
                    d="M 44.376953 5.9863281 C 43.889905 6.0076957 43.415817 6.1432497 42.988281 6.3144531 C 42.565113 6.4845113 40.128883 7.5243408 36.53125 9.0625 C 32.933617 10.600659 28.256963 12.603668 23.621094 14.589844 C 14.349356 18.562196 5.2382813 22.470703 5.2382812 22.470703 L 5.3046875 22.445312 C 5.3046875 22.445312 4.7547875 22.629122 4.1972656 23.017578 C 3.9185047 23.211806 3.6186028 23.462555 3.3730469 23.828125 C 3.127491 24.193695 2.9479735 24.711788 3.015625 25.259766 C 3.2532479 27.184511 5.2480469 27.730469 5.2480469 27.730469 L 5.2558594 27.734375 L 14.158203 30.78125 C 14.385177 31.538434 16.858319 39.792923 17.402344 41.541016 C 17.702797 42.507484 17.984013 43.064995 18.277344 43.445312 C 18.424133 43.635633 18.577962 43.782915 18.748047 43.890625 C 18.815627 43.933415 18.8867 43.965525 18.957031 43.994141 C 18.958531 43.994806 18.959437 43.99348 18.960938 43.994141 C 18.969579 43.997952 18.977708 43.998295 18.986328 44.001953 L 18.962891 43.996094 C 18.979231 44.002694 18.995359 44.013801 19.011719 44.019531 C 19.043456 44.030655 19.062905 44.030268 19.103516 44.039062 C 20.123059 44.395042 20.966797 43.734375 20.966797 43.734375 L 21.001953 43.707031 L 26.470703 38.634766 L 35.345703 45.554688 L 35.457031 45.605469 C 37.010484 46.295216 38.415349 45.910403 39.193359 45.277344 C 39.97137 44.644284 40.277344 43.828125 40.277344 43.828125 L 40.310547 43.742188 L 46.832031 9.7519531 C 46.998903 8.9915162 47.022612 8.334202 46.865234 7.7402344 C 46.707857 7.1462668 46.325492 6.6299361 45.845703 6.34375 C 45.365914 6.0575639 44.864001 5.9649605 44.376953 5.9863281 z M 44.429688 8.0195312 C 44.627491 8.0103707 44.774102 8.032983 44.820312 8.0605469 C 44.866523 8.0881109 44.887272 8.0844829 44.931641 8.2519531 C 44.976011 8.419423 45.000036 8.7721605 44.878906 9.3242188 L 44.875 9.3359375 L 38.390625 43.128906 C 38.375275 43.162926 38.240151 43.475531 37.931641 43.726562 C 37.616914 43.982653 37.266874 44.182554 36.337891 43.792969 L 26.632812 36.224609 L 26.359375 36.009766 L 26.353516 36.015625 L 23.451172 33.837891 L 39.761719 14.648438 A 1.0001 1.0001 0 0 0 38.974609 13 A 1.0001 1.0001 0 0 0 38.445312 13.167969 L 14.84375 28.902344 L 5.9277344 25.849609 C 5.9277344 25.849609 5.0423771 25.356927 5 25.013672 C 4.99765 24.994652 4.9871961 25.011869 5.0332031 24.943359 C 5.0792101 24.874869 5.1948546 24.759225 5.3398438 24.658203 C 5.6298218 24.456159 5.9609375 24.333984 5.9609375 24.333984 L 5.9941406 24.322266 L 6.0273438 24.308594 C 6.0273438 24.308594 15.138894 20.399882 24.410156 16.427734 C 29.045787 14.44166 33.721617 12.440122 37.318359 10.902344 C 40.914175 9.3649615 43.512419 8.2583658 43.732422 8.1699219 C 43.982886 8.0696253 44.231884 8.0286918 44.429688 8.0195312 z M 33.613281 18.792969 L 21.244141 33.345703 L 21.238281 33.351562 A 1.0001 1.0001 0 0 0 21.183594 33.423828 A 1.0001 1.0001 0 0 0 21.128906 33.507812 A 1.0001 1.0001 0 0 0 20.998047 33.892578 A 1.0001 1.0001 0 0 0 20.998047 33.900391 L 19.386719 41.146484 C 19.35993 41.068197 19.341173 41.039555 19.3125 40.947266 L 19.3125 40.945312 C 18.800713 39.30085 16.467362 31.5161 16.144531 30.439453 L 33.613281 18.792969 z M 22.640625 35.730469 L 24.863281 37.398438 L 21.597656 40.425781 L 22.640625 35.730469 z"
                    fill="currentColor"
                  />
                </svg>
              </motion.button>
              <AnimatePresence>
                {showBrowsers && (
                  <motion.div
                    className="browsers-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}>
                    {browsers.map((browser) => (
                      <motion.button
                        key={browser.name}
                        className="browser-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(browser.url, '_blank')}>
                        <img
                          src={browser.icon}
                          alt={`${browser.name} icon`}
                          className="browser-icon"
                          width="24"
                          height="24"
                        />
                        <span>{browser.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="scroll-content">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            Наши Преимущества
          </motion.div>

          <motion.div
            className="features-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <h3>Безопасность</h3>
              <p>Шифрование трафика и защита данных</p>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <h3>Скорость</h3>
              <p>Высокая скорость без ограничений</p>
            </div>
            <div className="feature">
              <span className="feature-icon">💬</span>
              <h3>Чиним Discord бесплатно</h3>
              <p>Без регистрации и лишних действий — просто скачайте и пользуйтесь.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <h3>Прозрачная Open Source система</h3>
              <p>Исходный код открыт для всех. Максимальная прозрачность и доверие.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🤝</span>
              <h3>Реферальная система</h3>
              <p>Приглашайте друзей и получайте бонусы за каждого подключившегося!</p>
            </div>
          </motion.div>

          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            Локации
          </motion.div>

          <div className="locations-container">
            {locations.map((location, index) => (
              <motion.div
                key={location.name}
                className="location-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}>
                <div className="location-header">
                  <img
                    src={location.flag}
                    alt={`${location.name} flag`}
                    className="location-flag"
                    width="32"
                    height="24"
                  />
                  <h3>{location.name}</h3>
                </div>
                <p className="ping-value">Пинг: {location.ping}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            Тарифы
          </motion.div>

          <div className="pricing-container">
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}>
              <div className="pricing-header">
                <h3>Безлимитный</h3>
                <div className="price">300₽</div>
              </div>
              <ul className="pricing-features">
                <li>1 месяц без ограничений</li>
                <li>Регион на выбор</li>
                <li>Неограниченный трафик</li>
                <li>Высокая скорость</li>
              </ul>
              <motion.button
                className="pricing-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  window.open('https://t.me/pesherkino_bot?start=ref_855347094', '_blank')
                }>
                Выбрать тариф
              </motion.button>
            </motion.div>

            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}>
              <div className="pricing-header">
                <h3>Трафик</h3>
                <div className="price">100₽</div>
              </div>
              <ul className="pricing-features">
                <li>50 ГБ трафика</li>
                <li>Без ограничения по времени</li>
                <li>Регион на выбор</li>
                <li>Высокая скорость</li>
              </ul>
              <motion.button
                className="pricing-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  window.open('https://t.me/pesherkino_bot?start=ref_855347094', '_blank')
                }>
                Выбрать тариф
              </motion.button>
            </motion.div>
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}>
              <div className="pricing-header">
                <h3>Discord Fix</h3>
                <div className="price">Бесплатно</div>
              </div>
              <ul className="pricing-features">
                <li>Локация - Германия, Франкфурт</li>
                <li>Высокая скорость</li>
                <li>Без ограничения по времени</li>
                <li>Безлимитный трафик</li>
              </ul>
              <motion.button
                className="pricing-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  window.open('https://t.me/pesherkino_bot?start=ref_855347094', '_blank')
                }>
                Выбрать тариф
              </motion.button>
            </motion.div>
          </div>
        </div>

        <div className="footer">
          <div className="footer-content">
            {footerLinks.map((link) =>
              link.url ? (
                <motion.a
                  key={link.name}
                  className="footer-button"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ textDecoration: 'none' }}>
                  <span className="footer-icon">{link.icon}</span>
                  <span className="footer-text">{link.name}</span>
                </motion.a>
              ) : (
                <motion.button
                  key={link.name}
                  className="footer-button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}>
                  <span className="footer-icon">{link.icon}</span>
                  <span className="footer-text">{link.name}</span>
                </motion.button>
              ),
            )}
          </div>
          <div className="footer-divider"></div>
          <div className="footer-copyright">© 2025 Pesherkino VPN. Все права защищены.</div>
          <div className="footer-copyright">
            Возникли проблемы, вопросы или предложения?
            <a
              href="https://t.me/your_support"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-support-link">
              Техническая поддержка
            </a>
          </div>
        </div>
        {/* МАСКОТ ПОД ФУТЕРОМ */}
        <motion.div className="mascot-block">
          <img src="/mascot.png" alt="Маскот Pesherkino VPN" className="mascot-img" />
          <motion.div
            className="mascot-cloud"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, rotate: [0, -2, 2, -1, 1, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.2 },
              y: { type: 'spring', stiffness: 60, damping: 10, duration: 0.8, delay: 0.2 },
              rotate: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 3.5,
                ease: 'easeInOut',
                delay: 1.2,
              },
            }}
            style={{ top: '-70px', position: 'relative' }}>
            Мы поможем оставаться на связи!
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
