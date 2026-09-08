import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  mode: 'light' | 'colored' | 'dark';
  setMode: (mode: 'light' | 'colored' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'colored',
      setMode: (mode) => set({ mode }),
    }),
    { name: "shigosag-terminal-ui" }
  )
);
