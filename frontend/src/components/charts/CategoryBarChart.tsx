'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SummaryData, Category } from '@/types/metrics';

export default function CategoryBarChart({
  summary,
  categories,
}: {
  summary: SummaryData | null;
  categories: Category[];
}) {
  const chartData = summary?.byCategory.map((item) => {
    const category = categories.find((c) => c.id === item.categoryId);
    return {
      name: category?.name || 'Unknown',
      revenue: item._sum.value || 0,
    };
  }) || [];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}