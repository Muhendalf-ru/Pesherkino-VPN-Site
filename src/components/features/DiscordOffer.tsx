import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DiscordOffer: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <motion.div
      className="discord-offer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}>
      <div
        className="discord-content"
        onMouseEnter={() => setShowInstructions(true)}
        onMouseLeave={() => setShowInstructions(false)}>
        <span className="discord-text">
          Мы починим ваш Discord <strong>бесплатно</strong>
        </span>
        <span className="heart-icon">❤️</span>
        <AnimatePresence>
          {showInstructions && (
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
                  Подключиться во вкладке <span className="highlight">Discord Free</span>
                </li>
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DiscordOffer;
