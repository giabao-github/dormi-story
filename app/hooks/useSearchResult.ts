import { categories } from './../components/sidebar/Categories';
import { create } from 'zustand';

interface SearchResultStore {
  type?: string;
  title?: string;
  author?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  setType: (value: string) => void;
  setTitle: (value: string) => void;
  setAuthor: (value: string) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  setCategory: (value: string) => void;
}

const useSearchResult = create<SearchResultStore>((set) => ({
  type: '',
  title: '',
  author: '',
  startDate: '',
  endDate: '',
  category: '',
  setType: (value: string) => set({ type: value }),
  setTitle: (value: string) => set({ title: value }),
  setAuthor: (value: string) => set({ author: value }),
  setStartDate: (value: string) => set({ startDate: value }),
  setEndDate: (value: string) => set({ endDate: value }),
  setCategory: (value: string) => set({ category: value }),
}));

export default useSearchResult;