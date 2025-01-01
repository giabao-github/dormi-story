import { create } from 'zustand';

interface ParkingDetailsModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useParkingDetailsModal = create<ParkingDetailsModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useParkingDetailsModal;