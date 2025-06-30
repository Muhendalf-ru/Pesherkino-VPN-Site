import React from 'react';
import { motion } from 'framer-motion';

const PricingSection: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default PricingSection;
