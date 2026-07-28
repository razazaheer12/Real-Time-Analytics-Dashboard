export interface Category {
  id: string;
  name: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
}

export interface Metric {
  id: string;
  title: string;
  value: number;
  unit: string;
  categoryId: string;
  regionId: string;
  createdAt: string;
  updatedAt: string;
  category: { name: string };
  region: { name: string; code: string };
}

export interface SummaryData {
  totalRevenue: number;
  byCategory: { categoryId: string; _sum: { value: number | null } }[];
  byRegion: { regionId: string; _sum: { value: number | null } }[];
}

export interface MetricsFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  regionId?: string;
}