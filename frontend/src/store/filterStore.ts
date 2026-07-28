import { create } from 'zustand';

interface FilterState {
  startDate: string;
  endDate: string;
  categoryId: string;
  regionId: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setCategoryId: (id: string) => void;
  setRegionId: (id: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  startDate: '',
  endDate: '',
  categoryId: '',
  regionId: '',
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setCategoryId: (id) => set({ categoryId: id }),
  setRegionId: (id) => set({ regionId: id }),
  resetFilters: () => set({ startDate: '', endDate: '', categoryId: '', regionId: '' }),
}));