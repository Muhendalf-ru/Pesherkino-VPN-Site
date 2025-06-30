import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/App.css';

// Импорты компонентов
import {
  DiscordOffer,
  DownloadButtons,
  LocationsGrid,
  PricingSection,
  FeaturesSection,
  StatsBanner,
} from '../components/features';
import { Footer } from '../components/layout';
import { AppGuideModal } from '../components/ui';

// Импорты хуков
import { usePingMeasurement } from '../hooks';
import { initialLocations } from '../data/locationsData';

function MainPage() {
  const [showAppGuide, setShowAppGuide] = useState(false);

  const locations = usePingMeasurement(initialLocations);

  const handleAppDownload = () => {
    window.open(
      'https://github.com/Muhendalf-ru/pesherkino-vpn/releases/download/v2.0.38/pesherkino-vpn-2.0.38-setup.exe',
      '_blank',
    );
  };

  return (
    <div className="app-container">
      <div className="animated-background" />
      <div className="space-elements">
        <div className="comet" />
        <img src="/neptune.svg" alt="Neptune" className="planet planet-neptune" />
        <img src="/planet.svg" alt="Planet 1" className="planet planet-1" />
        <img src="/planet.svg" alt="Planet 2" className="planet planet-2" />
        <img src="/planet.svg" alt="Planet 3" className="planet planet-3" />

        {/* Звезды */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className={`star star-${['small', 'medium', 'large'][Math.floor(Math.random() * 3)]}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              ['--duration' as string]: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Туманности */}
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
      </div>

      <div className="content">
        <div className="main-content">
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{
              scale: 1.05,
              textShadow: '0 0 8px rgba(255,255,255,0.5)',
              transition: { duration: 0.3 },
            }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="gradient-text">
              Pesherkino VPN
            </motion.span>
          </motion.h1>

          <DiscordOffer />

          <DownloadButtons
            onAppDownload={handleAppDownload}
            onShowAppGuide={() => setShowAppGuide(true)}
          />
        </div>

        <div className="scroll-content">
          <StatsBanner />

          <FeaturesSection />

          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            Локации
          </motion.div>

          <LocationsGrid locations={locations} />

          <PricingSection />
        </div>

        <Footer />

        <motion.div className="mascot-block">
          <img src="/mascot.png" alt="Маскот Pesherkino VPN" className="mascot-img" />
          <motion.div
            className="mascot-cloud"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, rotate: [0, -2, 2, -1, 1, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.2 },
              y: { type: 'spring', stiffness: 60, damping: 10, duration: 0.8, delay: 0.2 },
              rotate: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 3.5,
                ease: 'easeInOut',
                delay: 1.2,
              },
            }}
            style={{ top: '-70px', position: 'relative' }}>
            Мы поможем оставаться на связи!
          </motion.div>
        </motion.div>
      </div>

      <AppGuideModal isOpen={showAppGuide} onClose={() => setShowAppGuide(false)} />
    </div>
  );
}

export default MainPage;
