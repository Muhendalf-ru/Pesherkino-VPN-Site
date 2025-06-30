import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatsBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="stats-banner"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        width: '100%',
        maxWidth: 800,
        margin: '0 auto 2.5rem',
        background:
          'linear-gradient(135deg, rgba(41,98,255,0.15) 0%, rgba(139,92,246,0.12) 50%, rgba(59,130,246,0.08) 100%)',
        borderRadius: 24,
        boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.3)',
        padding: '2rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
        flexWrap: 'wrap',
        border: '1px solid rgba(59,130,246,0.2)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
      {/* Декоративные элементы */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <div
        style={{
          color: '#e2e8f0',
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: 0.5,
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 1,
          flex: 1,
          minWidth: 300,
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
            fontSize: 28,
          }}>
          <span
            style={{
              fontSize: 28,
            }}>
            🚀
          </span>
          <span
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}>
            Дополнительные возможности
          </span>
        </div>
        <div
          style={{
            fontWeight: 400,
            fontSize: 16,
            color: '#94a3b8',
            lineHeight: 1.5,
            maxWidth: 400,
          }}>
          Изучите статистику сервиса и получите подробную документацию для максимально эффективного
          использования
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}>
        <motion.button
          className="download-button"
          style={{
            fontSize: 15,
            padding: '14px 24px',
            fontWeight: 600,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.15))',
            color: '#e2e8f0',
            border: '1.5px solid rgba(59,130,246,0.4)',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(59,130,246,0.2)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            minWidth: 140,
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.25))',
            color: '#fff',
            borderColor: '#60a5fa',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/status')}>
          📊 Статистика
        </motion.button>
        <motion.button
          className="download-button"
          style={{
            fontSize: 15,
            padding: '14px 24px',
            fontWeight: 600,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.15))',
            color: '#e2e8f0',
            border: '1.5px solid rgba(139,92,246,0.4)',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(139,92,246,0.2)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            minWidth: 140,
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 8px 24px rgba(139,92,246,0.3)',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.25))',
            color: '#fff',
            borderColor: '#a855f7',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/wiki')}>
          📚 Wiki
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StatsBanner;
