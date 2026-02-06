import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "terminal_op" | "carrier";

interface User {
    id: string;
    email: string;
    role: Role;
    firstName: string;
    lastName: string;
    company?: string;
    terminalId?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage",
        }
    )
);
