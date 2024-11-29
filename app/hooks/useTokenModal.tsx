import { create } from 'zustand';

interface TokenModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useTokenModal = create<TokenModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useTokenModal;