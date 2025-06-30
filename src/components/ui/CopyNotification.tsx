import { motion, AnimatePresence } from 'framer-motion';

interface CopyNotificationProps {
  isVisible: boolean;
}

const CopyNotification = ({ isVisible }: CopyNotificationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="copy-notification"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}>
          <div className="copy-notification-content">
            <svg
              className="copy-notification-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            <span>Код скопирован!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CopyNotification;
