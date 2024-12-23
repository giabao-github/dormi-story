import { create } from 'zustand';

interface MetadataStore {
  audioTitle: string;
  documentTitle: string;
  artist: string;
  album: string;
  setAudioTitle: (title: string) => void;
  setDocumentTitle: (title: string) => void;
  setArtist: (artist: string) => void;
  setAlbum: (album: string) => void;
}

const useMetadata = create<MetadataStore>((set) => ({
  audioTitle: '',
  documentTitle: '',
  artist: '',
  album: '',
  setAudioTitle: (value) => set({ audioTitle: value }),
  setDocumentTitle: (value) => set({ documentTitle: value }),
  setArtist: (value) => set({ artist: value }),
  setAlbum: (value) => set({ album: value }),
}));

export default useMetadata;