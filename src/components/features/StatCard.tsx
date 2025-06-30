import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, delay = 0 }) => (
  <motion.div
    className="feature"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}>
    <span className="feature-icon">{icon}</span>
    <h3>{title}</h3>
    <div style={{ fontSize: 32, fontWeight: 700, color: '#82b1ff' }}>{value}</div>
  </motion.div>
);

export default StatCard;
