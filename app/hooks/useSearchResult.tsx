import { create } from 'zustand';

interface SearchResultStore {
  value: string;
  setValue: (value: string) => void;
}

const useSearchResult = create<SearchResultStore>((set) => ({
  value: '',
  setValue: (input) => set({ value: input }),
}));

export default useSearchResult;