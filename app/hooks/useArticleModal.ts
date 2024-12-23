import { create } from 'zustand';

interface ArticleModalStore {
  isOpen: boolean;
  disabled: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDisable: () => void;
  onValid: () => void;
}

const useArticleModal = create<ArticleModalStore>((set) => ({
  isOpen: false,
  disabled: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onDisable: () => set({ disabled: true }),
  onValid: () => set({ disabled: false }),
}));

export default useArticleModal;