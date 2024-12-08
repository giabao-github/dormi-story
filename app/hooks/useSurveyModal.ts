import { create } from 'zustand';

interface SurveyModalStore {
  isOpen: boolean;
  disabled: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDisable: () => void;
  onValid: () => void;
}

const useSurveyModal = create<SurveyModalStore>((set) => ({
  isOpen: false,
  disabled: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onDisable: () => set({ disabled: true }),
  onValid: () => set({ disabled: false }),
}));

export default useSurveyModal;