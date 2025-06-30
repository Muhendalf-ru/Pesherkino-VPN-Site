import React from 'react';
import { motion } from 'framer-motion';

const TelegramWidget: React.FC = () => (
  <motion.div
    className="telegram-widget"
    initial={{ opacity: 0, y: 30, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.7, delay: 0.5, type: 'spring', stiffness: 60 }}
    style={{
      marginTop: 40,
      background: 'rgba(41,98,255,0.08)',
      border: '1px solid #2962ff',
      borderRadius: 16,
      padding: 24,
      maxWidth: 420,
      width: '100%',
      boxShadow: '0 4px 24px rgba(41,98,255,0.10)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}
    whileHover={{ scale: 1.015, boxShadow: '0 8px 32px #2962ff33' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <motion.img
        src="/telegram.svg"
        alt="Telegram Bot"
        style={{ width: 40, height: 40, borderRadius: '50%' }}
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', repeatDelay: 2 }}
      />
      <span style={{ fontSize: 22, fontWeight: 700, color: '#82b1ff' }}>Telegram-бот</span>
    </div>
    <div
      style={{
        color: '#b0b8d0',
        fontSize: 16,
        textAlign: 'center',
        margin: '8px 0 12px',
      }}>
      Получайте быстрый доступ к VPN прямо из Telegram!
      <br />
      Управляйте подпиской, получайте помощь и приглашайте друзей.
    </div>
    <motion.a
      href="https://t.me/pesherkino_bot"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'linear-gradient(90deg,#36c3f6,#2962ff 80%)',
        color: '#fff',
        fontWeight: 600,
        fontSize: 18,
        borderRadius: 8,
        padding: '12px 28px',
        textDecoration: 'none',
        boxShadow: '0 2px 12px #2962ff44',
        transition: 'background 0.2s',
        cursor: 'pointer',
        outline: 'none',
        border: 'none',
        willChange: 'transform',
      }}
      whileHover={{
        scale: 1.06,
        boxShadow: '0 4px 32px #36c3f6cc',
        background: 'linear-gradient(90deg,#36c3f6 30%,#2962ff 100%)',
        filter: 'brightness(1.08) drop-shadow(0 0 8px #36c3f6cc)',
      }}
      whileTap={{ scale: 0.97 }}>
      <motion.img
        src="/telegram.svg"
        alt="Telegram"
        style={{ width: 24, height: 24, marginRight: 4, borderRadius: '50%' }}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: 'easeInOut',
          repeatDelay: 3,
        }}
      />
      Перейти к боту
    </motion.a>
  </motion.div>
);

export default TelegramWidget;
