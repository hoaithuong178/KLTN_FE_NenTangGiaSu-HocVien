import { create } from 'zustand';

type Role = 'student' | 'tutor' | 'admin' | null;

interface AuthState {
    user: { id: string; name: string; role: Role } | null;
    token: string | null;
    login: (user: AuthState['user'], token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    login: (user, token) => set({ user, token }),
    logout: () => set({ user: null, token: null }),
}));
