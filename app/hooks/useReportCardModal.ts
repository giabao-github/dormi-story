import { create } from 'zustand';

interface ReportCardModalStore {
  isOpen: boolean;
  name: string;
  studentId: string;
  createdAt: string;
  category: string;
  time: string;
  location: string;
  description: string;
  mediaLink: string;
  onOpen: () => void;
  onClose: () => void;
  setReportDetails: (name: string, studentId: string, createdAt: string, category: string, time: string, location: string, description: string, mediaLink: string) => void;
}

const useReportCardModal = create<ReportCardModalStore>((set) => ({
  isOpen: false,
  name: '',
  studentId: '',
  createdAt: '',
  category: '',
  time: '',
  location: '',
  description: '',
  mediaLink: '',
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setReportDetails: (name: string, studentId: string, createdAt: string, category: string, time: string, location: string, description: string, mediaLink: string) => 
    set({
      name, studentId, createdAt, category, time, location, description, mediaLink,
    }),
}));

export default useReportCardModal;