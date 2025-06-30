import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import '../styles/achievements.css';
import { CosmicSpinner } from '../components/ui';
import { Footer } from '../components/layout';
import { achievementsData } from '../data';

function AchievementsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredAchievement, setHoveredAchievement] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CosmicSpinner />;
  }

  return (
    <div className="app-container">
      <div className="space-elements">
        <div className="comet" />
        <img src="/neptune.svg" alt="Neptune" className="planet planet-neptune" />
        <img src="/planet.svg" alt="Planet 1" className="planet planet-1" />
        <img src="/planet.svg" alt="Planet 2" className="planet planet-2" />
        <img src="/planet.svg" alt="Planet 3" className="planet planet-3" />

        {/* Дополнительные космические элементы */}
        <div className="cosmic-orb cosmic-orb-1" />
        <div className="cosmic-orb cosmic-orb-2" />
        <div className="cosmic-orb cosmic-orb-3" />

        {/* Звезды */}
        {[...Array(40)].map((_, i) => (
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
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <motion.div
            className="cosmic-particles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={
                  {
                    '--delay': `${i * 0.2}s`,
                    '--duration': `${2 + Math.random() * 2}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </motion.div>

          <h1 className="page-title">
            <span className="gradient-text">Достижения</span>
          </h1>
          <p className="page-subtitle">Путь Pesherkino VPN через космос технологий</p>

          <motion.div
            className="achievement-counter"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}>
            <span className="counter-number">{achievementsData.length}</span>
            <span className="counter-label">достижений</span>
          </motion.div>
        </motion.div>

        <div className="scroll-content">
          <motion.div
            className="stats-overview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="stats-grid">
              <motion.div
                className="stat-card"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}>
                <div className="stat-number">80+</div>
                <div className="stat-label">Пользователей</div>
                <div className="stat-glow" />
              </motion.div>
              <motion.div
                className="stat-card"
                whileHover={{
                  scale: 1.05,
                  rotateY: -5,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}>
                <div className="stat-number">4</div>
                <div className="stat-label">Локации</div>
                <div className="stat-glow" />
              </motion.div>
              <motion.div
                className="stat-card"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}>
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Время работы</div>
                <div className="stat-glow" />
              </motion.div>
              <motion.div
                className="stat-card"
                whileHover={{
                  scale: 1.05,
                  rotateY: -5,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}>
                <div className="stat-number">24/7</div>
                <div className="stat-label">Поддержка</div>
                <div className="stat-glow" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="timeline-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}>
            <h2 className="section-title">Наша история</h2>
            <div className="timeline">
              {achievementsData.map((achievement, index) => (
                <motion.div
                  key={achievement.year}
                  className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  onHoverStart={() => setHoveredAchievement(achievement.year)}
                  onHoverEnd={() => setHoveredAchievement(null)}>
                  <div className="timeline-content">
                    <motion.div
                      className="timeline-year"
                      animate={
                        hoveredAchievement === achievement.year ? { scale: 1.1 } : { scale: 1 }
                      }
                      transition={{ duration: 0.2 }}>
                      {achievement.year}
                    </motion.div>
                    <h3 className="timeline-title">{achievement.title}</h3>
                    <p className="timeline-description">{achievement.description}</p>
                    {achievement.metrics && (
                      <div className="timeline-metrics">
                        {achievement.metrics.map((metric, metricIndex) => (
                          <motion.div
                            key={metricIndex}
                            className="metric"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            <span className="metric-value">{metric.value}</span>
                            <span className="metric-label">{metric.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {achievement.icon && (
                      <motion.div
                        className="timeline-icon"
                        animate={
                          hoveredAchievement === achievement.year ? { rotate: 360 } : { rotate: 0 }
                        }
                        transition={{ duration: 0.5 }}>
                        <img src={achievement.icon} alt={achievement.title} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="milestones-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}>
            <h2 className="section-title">Ключевые вехи</h2>
            <div className="milestones-grid">
              {achievementsData
                .filter((achievement) => achievement.isMilestone)
                .map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    className="milestone-card"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      transition: { duration: 0.3 },
                    }}
                    whileTap={{ scale: 0.95 }}>
                    <div className="milestone-year">{milestone.year}</div>
                    <h3 className="milestone-title">{milestone.title}</h3>
                    <p className="milestone-description">{milestone.description}</p>
                    <motion.div
                      className="milestone-badge"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                      <span>🏆</span>
                    </motion.div>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          <motion.div
            className="future-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}>
            <h2 className="section-title">Планы на будущее</h2>
            <div className="future-grid">
              <motion.div
                className="future-card"
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}>
                <motion.div
                  className="future-icon"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  🚀
                </motion.div>
                <h3>Глобальное расширение</h3>
                <p>Добавление новых локаций по всему миру</p>
              </motion.div>
              <motion.div
                className="future-card"
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}>
                <motion.div
                  className="future-icon"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
                  🔒
                </motion.div>
                <h3>Улучшенная безопасность</h3>
                <p>Новые протоколы шифрования и защиты</p>
              </motion.div>
              <motion.div
                className="future-card"
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}>
                <motion.div
                  className="future-icon"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                  📱
                </motion.div>
                <h3>Мобильные приложения</h3>
                <p>Нативные приложения для всех платформ</p>
              </motion.div>
              <motion.div
                className="future-card"
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.98 }}>
                <motion.div
                  className="future-icon"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}>
                  🤖
                </motion.div>
                <h3>AI-функции</h3>
                <p>Умный выбор серверов и оптимизация</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Космическая цитата */}
        <motion.div
          className="cosmic-quote-block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}>
          <div className="cosmic-quote-decor">
            <span className="cosmic-quote-rocket" role="img" aria-label="Ракета">
              🚀
            </span>
            <span className="cosmic-quote-star star1">✦</span>
            <span className="cosmic-quote-star star2">✧</span>
            <span className="cosmic-quote-star star3">✦</span>
          </div>
          <blockquote className="cosmic-quote">
            <span className="cosmic-quote-mark">“</span>
            Мы развиваемся для вас — изучаем передовые технологии, прокладываем путь в цифровой
            космос, чтобы вы всегда оставались на связи, в безопасности и в любимых играх. Вместе с
            вашей поддержкой мы — ваша ракета в мир свободы, защиты и безграничных возможностей
            интернета.
            <span className="cosmic-quote-mark">”</span>
          </blockquote>
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}

export default AchievementsPage;
