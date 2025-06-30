import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="animated-background" />
      <div className="space-elements">
        <div className="comet" />
        <img src="/neptune.svg" alt="Neptune" className="planet planet-neptune" />
        <img src="/planet.svg" alt="Planet 1" className="planet planet-1" />
        <img src="/planet.svg" alt="Planet 2" className="planet planet-2" />
        <img src="/planet.svg" alt="Planet 3" className="planet planet-3" />
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-404-${i}`}
            className={`star star-${['small', 'medium', 'large'][Math.floor(Math.random() * 3)]}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              ['--duration' as string]: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
      </div>
      <div
        className="content"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="gradient-text notfound-title">
          404
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="notfound-subtitle">
          Ой! Такой страницы не существует
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="notfound-desc">
          Похоже, вы заблудились в космосе. Давайте вернёмся на главную планету!
        </motion.div>
        <motion.button
          className="download-button notfound-btn"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}>
          На главную
        </motion.button>
      </div>
      <motion.div
        className="mascot-block notfound-mascot-block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          opacity: { duration: 0.8, delay: 0.2 },
          y: { type: 'spring', stiffness: 60, damping: 10, duration: 0.8, delay: 0.2 },
        }}>
        <img src="/mascot.png" alt="Маскот Pesherkino VPN" className="mascot-img" />
        <motion.div
          className="mascot-cloud notfound-mascot-cloud"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}>
          Даже маскот потерялся :(
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;
