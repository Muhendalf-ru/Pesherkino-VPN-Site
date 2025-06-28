import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import './App.css';

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
              <motion.div
                className="feature"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <span className="feature-icon">🖥️</span>
                <h3>Пользователей приложения</h3>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#82b1ff' }}>
                  {stats.desktopAppUsers}
                </div>
              </motion.div>
              <motion.div
                className="feature"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                <span className="feature-icon">🤖</span>
                <h3>Пользователей Telegram-бота</h3>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#82b1ff' }}>
                  {stats.botUsers}
                </div>
              </motion.div>
              <motion.div
                className="feature"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}>
                <span className="feature-icon">🚀</span>
                <h3>Всего запусков Desktop приложения</h3>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#82b1ff' }}>
                  {stats.totalLaunchCount}
                </div>
              </motion.div>
            </div>
            <div
              style={{
                width: '100%',
                maxWidth: 600,
                background: 'rgba(17,24,39,0.7)',
                borderRadius: 24,
                padding: 32,
                boxShadow: '0 8px 32px rgba(41,98,255,0.10)',
                margin: '0 auto',
                marginBottom: 24,
              }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 24, right: 24, left: 0, bottom: 16 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95} />
                      <stop offset="80%" stopColor="#8b5cf6" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#1e293b" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#233" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#8b5cf6"
                    tick={{ fill: '#b0b8d0', fontWeight: 700, fontSize: 16 }}
                    axisLine={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <YAxis
                    stroke="#8b5cf6"
                    tick={{ fill: '#b0b8d0', fontWeight: 700, fontSize: 15 }}
                    axisLine={{ stroke: '#3b82f6', strokeWidth: 2 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(41,98,255,0.95)',
                      border: 'none',
                      borderRadius: 12,
                      color: '#fff',
                      boxShadow: '0 4px 16px #3b82f655',
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 600, fontSize: 16 }}
                    labelStyle={{ color: '#fff', fontWeight: 700, fontSize: 16 }}
                    cursor={{ fill: 'rgba(139,92,246,0.12)' }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#fff', fontWeight: 600, fontSize: 16 }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="Пользователи"
                    fill="url(#barGradient)"
                    radius={[12, 12, 8, 8]}
                    barSize={48}
                    isAnimationActive={true}>
                    {/* Можно добавить кастомные эффекты при наведении через content prop или через styled-components */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
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
                <span style={{ fontSize: 22, fontWeight: 700, color: '#82b1ff' }}>
                  Telegram-бот
                </span>
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
