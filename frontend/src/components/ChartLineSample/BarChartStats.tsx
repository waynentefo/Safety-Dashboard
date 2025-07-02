import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';

interface BarChartStatsProps {
  data: { name: string; value: number }[];
}

const BarChartStats: React.FC<BarChartStatsProps> = ({ data }) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Overview Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Count" fill="#3182ce" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartStats;
