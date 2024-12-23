import { create } from 'zustand';

interface SurveyModalStore {
  isOpen: boolean;
  disabled: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSurveyModal = create<SurveyModalStore>((set) => ({
  isOpen: false,
  disabled: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSurveyModal;