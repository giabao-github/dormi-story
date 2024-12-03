import { create } from 'zustand';

interface TokenModalStore {
  isOpen: boolean;
  label: string;
  onOpen: () => void;
  onClose: () => void;
  onCreate: () => void;
  onUpdate: () => void;
}

const useTokenModal = create<TokenModalStore>((set) => ({
  isOpen: false,
  label: '',
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onCreate: () => set({ label: 'create' }),
  onUpdate: () => set({ label: 'update' }),
}));

export default useTokenModal;