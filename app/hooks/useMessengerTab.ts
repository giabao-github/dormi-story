import { create } from 'zustand';

interface MessengerTabStore {
  width: number;
  height: number;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
}

const useMessengerTab = create<MessengerTabStore>((set) => ({
  width: 0,
  height: 0,
  setWidth: (value) => set({ width: value }),
  setHeight: (value) => set({ height: value }),
}));

export default useMessengerTab;