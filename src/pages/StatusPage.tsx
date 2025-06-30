import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import StatCard from '../components/features/StatCard';
import StatsBarChart from '../components/features/StatsBarChart';
import TelegramWidget from '../components/features/TelegramWidget';

interface StatsData {
  desktopAppUsers: number;
  botUsers: number;
  totalLaunchCount: number;
}

export default function Status() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://sub.pesherkino.store:8443/pesherkino/charts/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Для графика
  const chartData = stats
    ? [
        {
          name: 'Десктоп-приложение',
          Пользователи: stats.desktopAppUsers,
        },
        {
          name: 'Telegram-бот',
          Пользователи: stats.botUsers,
        },
        {
          name: 'Запусков всего',
          Пользователи: stats.totalLaunchCount,
        },
      ]
    : [];

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: 0 }}>
      <div className="animated-background" />
      <div className="space-elements">
        <div className="comet" />
        <img src="/neptune.svg" alt="Neptune" className="planet planet-neptune" />
        <img src="/planet.svg" alt="Planet 1" className="planet planet-1" />
        <img src="/planet.svg" alt="Planet 2" className="planet planet-2" />
        <img src="/planet.svg" alt="Planet 3" className="planet planet-3" />
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-status-${i}`}
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
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <motion.div
          className="gradient-text notfound-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}>
          Статистика Pesherkino VPN
        </motion.div>
        {loading && <div className="notfound-desc">Загрузка...</div>}
        {error && (
          <div className="notfound-desc" style={{ color: '#ff6b6b' }}>
            {error}
          </div>
        )}
        {stats && (
          <>
            <div
              style={{
                display: 'flex',
                gap: 32,
                margin: '32px 0',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <StatCard
                icon={
                  <span role="img" aria-label="desktop">
                    🖥️
                  </span>
                }
                title="Пользователей приложения"
                value={stats.desktopAppUsers}
                delay={0.2}
              />
              <StatCard
                icon={
                  <span role="img" aria-label="bot">
                    🤖
                  </span>
                }
                title="Пользователей Telegram-бота"
                value={stats.botUsers}
                delay={0.3}
              />
              <StatCard
                icon={
                  <span role="img" aria-label="launch">
                    🚀
                  </span>
                }
                title="Всего запусков Desktop приложения"
                value={stats.totalLaunchCount}
                delay={0.4}
              />
            </div>
            <StatsBarChart data={chartData} />
            <TelegramWidget />
            <motion.button
              className="download-button"
              style={{ marginTop: 32, fontSize: 20, padding: '14px 38px', fontWeight: 600 }}
              whileHover={{ scale: 1.07, boxShadow: '0 4px 24px #3b82f6cc' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/')}>
              Вернуться на главную
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
