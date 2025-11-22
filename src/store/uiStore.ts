import { create } from 'zustand';

interface UIState {
  quickCaptureOpen: boolean;
  setQuickCaptureOpen: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  quickCaptureOpen: false,
  setQuickCaptureOpen: (value) => set({ quickCaptureOpen: value }),
}));

