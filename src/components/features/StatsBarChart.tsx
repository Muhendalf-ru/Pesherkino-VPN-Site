import React from 'react';
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

interface ChartDataItem {
  name: string;
  Пользователи: number;
}

interface StatsBarChartProps {
  data: ChartDataItem[];
}

const StatsBarChart: React.FC<StatsBarChartProps> = ({ data }) => (
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
      <BarChart data={data} margin={{ top: 24, right: 24, left: 0, bottom: 16 }}>
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
        <Legend wrapperStyle={{ color: '#fff', fontWeight: 600, fontSize: 16 }} iconType="circle" />
        <Bar
          dataKey="Пользователи"
          fill="url(#barGradient)"
          radius={[12, 12, 8, 8]}
          barSize={48}
          isAnimationActive={true}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default StatsBarChart;
