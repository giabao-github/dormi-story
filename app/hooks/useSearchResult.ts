import { create } from 'zustand';

interface SearchResultStore {
  type: string;
  title: string;
  filter: boolean;
  setType: (value: string) => void;
  setTitle: (value: string) => void;
  onFilter: () => void;
  offFilter: () => void;
}

const useSearchResult = create<SearchResultStore>((set) => ({
  type: '',
  title: '',
  filter: false,
  setType: (value: string) => set({ type: value }),
  setTitle: (value: string) => set({ title: value }),
  onFilter: () => set((prev) => {
    if (!prev.filter) {
      return { ...prev, filter: true };
    }
    return prev;
  }),
  offFilter: () => set((prev) => {
    if (prev.filter) {
      return { ...prev, filter: false };
    }
    return prev;
  }),
}));

export default useSearchResult;