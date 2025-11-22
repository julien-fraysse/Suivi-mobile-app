import { create } from 'zustand';

interface PreferencesState {
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  themeMode: 'system',
  setThemeMode: (mode) => set({ themeMode: mode }),
}));

