import { create } from 'zustand';

interface LoginModalStore {
  isOpen: boolean;
  isIdError: boolean;
  isPasswordError: boolean;
  onOpen: () => void;
  onClose: () => void;
  onIdError: () => void;
  onIdValid: () => void;
  onPasswordError: () => void;
  onPasswordValid: () => void;
}

const useLoginModal = create<LoginModalStore>((set) => ({
  isOpen: false,
  isIdError: false,
  isPasswordError: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onIdError: () => set({ isIdError: true }),
  onIdValid: () => set({ isIdError: false }),
  onPasswordError: () => set({ isPasswordError: true }),
  onPasswordValid: () => set({ isPasswordError: false }),
}));

export default useLoginModal;