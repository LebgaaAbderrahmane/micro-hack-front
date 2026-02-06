import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
    theme: "light" | "dark";
    toggleTheme: () => void;
    isHydrated: boolean;
    setHydrated: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: "dark",
            isHydrated: false,
            setHydrated: () => set({ isHydrated: true }),
            toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
        }),
        {
            name: "theme-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
