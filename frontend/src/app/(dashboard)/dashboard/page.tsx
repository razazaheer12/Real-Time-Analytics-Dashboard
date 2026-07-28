'use client';

import { useEffect, useState } from 'react';
import { useMetrics } from '@/hooks/useMetrics';
import { useSocket } from '@/hooks/useSocket';
import { useFilterStore } from '@/store/filterStore';
import { Metric } from '@/types/metrics';
import FilterBar from '@/components/filters/FilterBar';
import ExportButtons from '@/components/export/ExportButtons';
import RequireRole from '@/components/RequireRole';
import RevenueLineChart from '@/components/charts/RevenueLineChart';
import CategoryBarChart from '@/components/charts/CategoryBarChart';
import DistributionPieChart from '@/components/charts/DistributionPieChart';
import { ChartSkeleton, CardSkeleton } from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const { startDate, endDate, categoryId, regionId } = useFilterStore();

  const { metrics, summary, categories, regions, loading, error } = useMetrics({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    categoryId: categoryId || undefined,
    regionId: regionId || undefined,
  });

  const { subscribe } = useSocket();
  const [liveMetrics, setLiveMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    setLiveMetrics(metrics);
  }, [metrics]);

  useEffect(() => {
    const unsubscribe = subscribe<Metric>('metric:new', (newMetric) => {
      const matchesCategory = !categoryId || newMetric.categoryId === categoryId;
      const matchesRegion = !regionId || newMetric.regionId === regionId;

      if (matchesCategory && matchesRegion) {
        setLiveMetrics((prev) => [newMetric, ...prev]);
      }
    });

    return unsubscribe;
  }, [subscribe, categoryId, regionId]);

  return (
    <div className="space-y-6">
      {/* Filters + Export — ek hi row mein */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <FilterBar categories={categories} regions={regions} />

        <RequireRole allowedRoles={['ADMIN']}>
          <ExportButtons />
        </RequireRole>
      </div>

      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <ChartSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      )}

      {!loading && !error && liveMetrics.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No data available for the selected filters.
        </div>
      )}

      {!loading && !error && liveMetrics.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ${summary?.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-2xl font-bold text-gray-800">{liveMetrics.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
            </div>
          </div>

          {/* Charts */}
          <RevenueLineChart metrics={liveMetrics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBarChart summary={summary} categories={categories} />

            <RequireRole
              allowedRoles={['ADMIN']}
              fallback={
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center h-[344px] text-center">
                  <svg
                    className="w-10 h-10 text-gray-300 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">Region breakdown is restricted to Admins</p>
                </div>
              }
            >
              <DistributionPieChart summary={summary} regions={regions} />
            </RequireRole>
          </div>
        </>
      )}
    </div>
  );
}