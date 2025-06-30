import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default FeaturesSection;
