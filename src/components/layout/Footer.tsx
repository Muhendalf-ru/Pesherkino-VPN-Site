import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FooterLink {
  name: string;
  icon: string;
  url?: string;
}

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const footerLinks: FooterLink[] = [
    { name: 'Github', icon: '⚡', url: 'https://github.com/Muhendalf-ru/pesherkino-vpn' },
    { name: 'Wiki', icon: '📚', url: '/wiki' },
    { name: 'Купить VPN', icon: '💎', url: 'https://t.me/pesherkino_bot?start=ref_855347094' },
    { name: 'Поддержка', icon: '🛟', url: 'https://t.me/pesherkino' },
  ];

  return (
    <div className="footer">
      <div className="footer-content">
        {footerLinks.map((link) =>
          link.url ? (
            link.url.startsWith('/') ? (
              <motion.button
                key={link.name}
                className="footer-button"
                onClick={() => navigate(link.url!)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  textDecoration: 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}>
                <span className="footer-icon">{link.icon}</span>
                <span className="footer-text">{link.name}</span>
              </motion.button>
            ) : (
              <motion.a
                key={link.name}
                className="footer-button"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{ textDecoration: 'none' }}>
                <span className="footer-icon">{link.icon}</span>
                <span className="footer-text">{link.name}</span>
              </motion.a>
            )
          ) : (
            <motion.button
              key={link.name}
              className="footer-button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}>
              <span className="footer-icon">{link.icon}</span>
              <span className="footer-text">{link.name}</span>
            </motion.button>
          ),
        )}
      </div>
      <div className="footer-divider"></div>
      <div className="footer-copyright">© 2025 Pesherkino VPN. Все права защищены.</div>
      <div className="footer-copyright">
        Возникли проблемы, вопросы или предложения?
        <a
          href="https://t.me/your_support"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-support-link">
          Техническая поддержка
        </a>
      </div>
    </div>
  );
};

export default Footer;
