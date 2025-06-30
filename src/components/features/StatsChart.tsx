import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

interface StatsChartProps {
  stats: StatsData;
}

const StatsChart: React.FC<StatsChartProps> = ({ stats }) => {
  return (
    <div className="stats-chart">
      <h3>Активность за последние 24 часа</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats.chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} />
          <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="connections"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
