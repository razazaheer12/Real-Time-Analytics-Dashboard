'use client';

import { useFilterStore } from '@/store/filterStore';
import { Category } from '@/types/metrics';

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const { categoryId, setCategoryId } = useFilterStore();

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border border-gray-300 bg-white text-gray-900 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px] shadow-sm cursor-pointer"
      >
        <option value="" className="text-gray-900 bg-white">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id} className="text-gray-900 bg-white py-1">
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}