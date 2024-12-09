import { create } from 'zustand';

interface MessengerSidebarStore {
  width: number;
  height: number;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
}

const useMessengerSidebar = create<MessengerSidebarStore>((set) => ({
  width: 0,
  height: 0,
  setWidth: (value) => set({ width: value }),
  setHeight: (value) => set({ height: value }),
}));

export default useMessengerSidebar;