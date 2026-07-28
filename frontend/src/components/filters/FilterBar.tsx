'use client';

import { useFilterStore } from '@/store/filterStore';
import { Category, Region } from '@/types/metrics';
import DateRangeFilter from './DateRangeFilter';
import CategoryFilter from './CategoryFilter';
import RegionFilter from './RegionFilter';
import RequireRole from '@/components/RequireRole';

export default function FilterBar({
  categories,
  regions,
}: {
  categories: Category[];
  regions: Region[];
}) {
  const { resetFilters, startDate, endDate, categoryId, regionId } = useFilterStore();

  const hasActiveFilters = startDate || endDate || categoryId || regionId;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-end gap-4">
      <DateRangeFilter />
      <CategoryFilter categories={categories} />

      <RequireRole allowedRoles={['ADMIN']}>
        <RegionFilter regions={regions} />
      </RequireRole>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:underline mb-0.5"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}