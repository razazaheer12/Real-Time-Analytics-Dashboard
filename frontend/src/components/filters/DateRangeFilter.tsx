'use client';

import { useFilterStore } from '@/store/filterStore';

export default function DateRangeFilter() {
  const { startDate, endDate, setStartDate, setEndDate } = useFilterStore();

  return (
    <div className="flex items-center gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 bg-white text-gray-900 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 bg-white text-gray-900 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
        />
      </div>
    </div>
  );
}