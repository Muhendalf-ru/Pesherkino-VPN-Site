import { motion, AnimatePresence } from 'framer-motion';

interface LinkNotificationProps {
  isVisible: boolean;
}

const LinkNotification = ({ isVisible }: LinkNotificationProps) => {
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

export default LinkNotification;
