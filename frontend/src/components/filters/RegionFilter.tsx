'use client';

import { useFilterStore } from '@/store/filterStore';
import { Region } from '@/types/metrics';

export default function RegionFilter({ regions }: { regions: Region[] }) {
  const { regionId, setRegionId } = useFilterStore();

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
      <select
        value={regionId}
        onChange={(e) => setRegionId(e.target.value)}
        className="border border-gray-300 bg-white text-gray-900 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px] shadow-sm cursor-pointer"
      >
        <option value="" className="text-gray-900 bg-white">All Regions</option>
        {regions.map((region) => (
          <option key={region.id} value={region.id} className="text-gray-900 bg-white py-1">
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
}