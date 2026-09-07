import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  coloredMode: boolean;
  toggleColoredMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      coloredMode: true,
      toggleColoredMode: () => set((state) => ({ coloredMode: !state.coloredMode })),
    }),
    { name: "shigosag-theme-settings" }
  )
);
