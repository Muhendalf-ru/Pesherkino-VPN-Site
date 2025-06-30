import { useState } from 'react';
import CopyNotification from './CopyNotification';

interface CodeBlockProps {
  children: string;
}

const CodeBlock = ({ children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setShowNotification(true);

      // Скрываем уведомление через 2 секунды
      setTimeout(() => {
        setShowNotification(false);
        setTimeout(() => setCopied(false), 300); // Скрываем состояние кнопки после анимации
      }, 2000);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  return (
    <div className="code-block">
      <CopyNotification isVisible={showNotification} />
      <button className={`code-copy-button ${copied ? 'copied' : ''}`} onClick={handleCopy}>
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            Скопировано
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Копировать
          </>
        )}
      </button>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
