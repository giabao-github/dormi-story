import { create } from 'zustand';

interface ParkingLotModalStore {
  isOpen: boolean;
  disabled: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useParkingLotModal = create<ParkingLotModalStore>((set) => ({
  isOpen: false,
  disabled: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useParkingLotModal;