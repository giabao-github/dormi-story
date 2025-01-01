import { create } from 'zustand';

interface RequestsModalStore {
  isOpen: boolean;
  notification: number;
  disabled: boolean;
  sentRequests: any[];
  receivedRequests: any[];
  pendingRequests: any[];
  onOpen: () => void;
  onClose: () => void;
  setNotification: (value: number) => void;
  setDisabled: (value: boolean) => void;
  setSentRequests: (value: any[]) => void;
  setReceivedRequests: (value: any[]) => void;
  setPendingRequests: (value: any[]) => void;
}

const useRequestsModal = create<RequestsModalStore>((set) => ({
  isOpen: false,
  notification: 0,
  disabled: false,
  sentRequests: [],
  receivedRequests: [],
  pendingRequests: [],
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setNotification: (value: number) => set({ notification: value }),
  setDisabled: (value: boolean) => set({ disabled: value }),
  setSentRequests: (value: any[]) => set({ sentRequests: value }),
  setReceivedRequests: (value: any[]) => set({ receivedRequests: value }),
  setPendingRequests: (value: any[]) => set({ pendingRequests: value }),
}));

export default useRequestsModal;