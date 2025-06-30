import React from 'react';
import { motion } from 'framer-motion';

interface StatsData {
  users: number;
  connections: number;
  uptime: number;
  bandwidth: number;
  chartData: Array<{
    time: string;
    users: number;
    connections: number;
  }>;
}

interface StatsCardsProps {
  stats: StatsData;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / 24);
    const hours = uptime % 24;
    return `${days}д ${hours}ч`;
  };

  const formatBandwidth = (bandwidth: number) => {
    if (bandwidth >= 1024 * 1024 * 1024) {
      return (bandwidth / (1024 * 1024 * 1024)).toFixed(1) + ' TB';
    }
    if (bandwidth >= 1024 * 1024) {
      return (bandwidth / (1024 * 1024)).toFixed(1) + ' GB';
    }
    if (bandwidth >= 1024) {
      return (bandwidth / 1024).toFixed(1) + ' MB';
    }
    return bandwidth + ' KB';
  };

  return (
    <div className="stats-cards">
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.05 }}>
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3>Активные пользователи</h3>
          <p className="stat-value">{formatNumber(stats.users)}</p>
        </div>
      </motion.div>

      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}>
        <div className="stat-icon">🔗</div>
        <div className="stat-content">
          <h3>Активные соединения</h3>
          <p className="stat-value">{formatNumber(stats.connections)}</p>
        </div>
      </motion.div>

      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}>
        <div className="stat-icon">⏱️</div>
        <div className="stat-content">
          <h3>Время работы</h3>
          <p className="stat-value">{formatUptime(stats.uptime)}</p>
        </div>
      </motion.div>

      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}>
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <h3>Пропускная способность</h3>
          <p className="stat-value">{formatBandwidth(stats.bandwidth)}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsCards;
