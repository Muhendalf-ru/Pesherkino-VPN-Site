import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface AppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppGuideModal: React.FC<AppGuideModalProps> = ({ isOpen, onClose }) => {
  const appGuideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="app-guide-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ zIndex: 99999 }}
          />
          <motion.div
            className="app-guide-modal"
            ref={appGuideRef}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 120 }}
            style={{ zIndex: 100000 }}>
            <button className="app-guide-close" onClick={onClose} title="Закрыть">
              ×
            </button>
            <div className="app-guide-content">
              <h2>Установка Pesherkino VPN</h2>
              <ol className="app-guide-steps">
                <li>
                  <span className="app-guide-step-num">1</span> Установите и откройте приложение
                </li>
                <li>
                  <span className="app-guide-step-num">2</span> Перейдите во вкладку "Дискорд"
                </li>
                <li>
                  <span className="app-guide-step-num">3</span> Выберите Discord Free
                </li>
                <li>
                  <span className="app-guide-step-num">4</span> Нажмите Запустить
                </li>
              </ol>
              <div className="app-guide-warning">
                <b>⚠️ Любые проблемы, вопросы или сложности?</b>
                <br />
                Напишите в{' '}
                <a
                  href="https://t.me/your_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-guide-link">
                  техподдержку
                </a>{' '}
                — мы поможем быстро и бесплатно!
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default AppGuideModal;
