import { create } from 'zustand';

interface ParkingRequestsModalStore {
  isOpen: boolean;
  notification: number;
  disabled: boolean;
  onOpen: () => void;
  onClose: () => void;
  setNotification: (value: number) => void;
  setDisabled: (value: boolean) => void;
}

const useParkingRequestsModal = create<ParkingRequestsModalStore>((set) => ({
  isOpen: false,
  notification: 0,
  disabled: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setNotification: (value: number) => set({ notification: value }),
  setDisabled: (value: boolean) => set({ disabled: value }),
}));

export default useParkingRequestsModal;