import { create } from 'zustand';

interface BuildingModalStore {
  isOpen: boolean;
  disabled: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useBuildingModal = create<BuildingModalStore>((set) => ({
  isOpen: false,
  disabled: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useBuildingModal;