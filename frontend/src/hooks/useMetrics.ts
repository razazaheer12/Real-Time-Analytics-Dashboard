'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { Metric, SummaryData, Category, Region, MetricsFilters } from '@/types/metrics';

export function useMetrics(filters: MetricsFilters) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.regionId) params.append('regionId', filters.regionId);

      const [metricsRes, summaryRes] = await Promise.all([
        api.get<Metric[]>(`/metrics?${params.toString()}`),
        api.get<SummaryData>(`/metrics/summary?${params.toString()}`),
      ]);

      setMetrics(metricsRes.data);
      setSummary(summaryRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate, filters.categoryId, filters.regionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Categories/regions ek hi baar fetch karo (filters ke liye dropdown options)
    const fetchOptions = async () => {
      try {
        const requests: Promise<any>[] = [api.get<Category[]>('/metrics/categories')];

        // Sirf Admin ke liye regions fetch karo (Viewer ke liye backend 403 dega)
        if (user?.role === 'ADMIN') {
          requests.push(api.get<Region[]>('/metrics/regions'));
        }

        const results = await Promise.all(requests);
        setCategories(results[0].data);

        if (results[1]) {
          setRegions(results[1].data);
        }
      } catch (err) {
        console.error('Failed to load filter options', err);
      }
    };

    if (user) {
      fetchOptions();
    }
  }, [user]);

  return { metrics, summary, categories, regions, loading, error, refetch: fetchData };
}