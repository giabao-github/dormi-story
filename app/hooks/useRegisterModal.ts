import { create } from 'zustand';

interface RegisterModalStore {
  isOpen: boolean;
  isNameError: boolean;
  isIdError: boolean;
  isEmailError: boolean;
  isPasswordError: boolean;
  onOpen: () => void;
  onClose: () => void;
  onNameError: () => void;
  onNameValid: () => void;
  onIdError: () => void;
  onIdValid: () => void;
  onEmailError: () => void;
  onEmailValid: () => void;
  onPasswordError: () => void;
  onPasswordValid: () => void;
}

const useRegisterModal = create<RegisterModalStore>((set) => ({
  isOpen: false,
  isNameError: false,
  isIdError: false,
  isEmailError: false,
  isPasswordError: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onNameError: () => set({ isNameError: true }),
  onNameValid: () => set({ isNameError: false }),
  onIdError: () => set({ isIdError: true }),
  onIdValid: () => set({ isIdError: false }),
  onEmailError: () => set({ isEmailError: true }),
  onEmailValid: () => set({ isEmailError: false }),
  onPasswordError: () => set({ isPasswordError: true }),
  onPasswordValid: () => set({ isPasswordError: false }),
}));

export default useRegisterModal;