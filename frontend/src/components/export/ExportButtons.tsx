'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useFilterStore } from '@/store/filterStore';
import { useToast } from '@/context/ToastContext';

export default function ExportButtons() {
  const { startDate, endDate, categoryId, regionId } = useFilterStore();
  const [downloading, setDownloading] = useState<'csv' | 'pdf' | null>(null);
  const { showToast } = useToast();

  const buildParams = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (categoryId) params.append('categoryId', categoryId);
    if (regionId) params.append('regionId', regionId);
    return params.toString();
  };

  const handleExport = async (type: 'csv' | 'pdf') => {
    setDownloading(type);
    try {
      const params = buildParams();
      const response = await api.get(`/export/${type}?${params}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: type === 'csv' ? 'text/csv' : 'application/pdf',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report.${type}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast(`${type.toUpperCase()} exported successfully`, 'success');
    } catch (err) {
      console.error(`Failed to export ${type}`, err);
      showToast(`Failed to export ${type.toUpperCase()}. Please try again.`, 'error');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport('csv')}
        disabled={downloading !== null}
        className="text-sm px-3 py-1.5 border border-gray-300 rounded font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        {downloading === 'csv' ? 'Exporting...' : '📄 Export CSV'}
      </button>
      <button
        onClick={() => handleExport('pdf')}
        disabled={downloading !== null}
        className="text-sm px-3 py-1.5 border border-gray-300 rounded font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        {downloading === 'pdf' ? 'Exporting...' : '📑 Export PDF'}
      </button>
    </div>
  );
}