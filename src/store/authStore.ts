import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Role = 'STUDENT' | 'TUTOR' | 'ADMIN' | null;

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    address?: string;
    gender?: string;
    birthYear?: number;
    educationLevel?: string;
    totalClasses?: number;
    role: Role;
}

interface AuthState {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            login: (user, token) => {
                if (!user || !token) {
                    console.error('Lỗi đăng nhập: Thiếu user hoặc token');
                    return;
                }
                set({ user, token });
            },
            logout: () => set({ user: null, token: null }),
            setUser: (user) => set((state) => ({ ...state, user })),
            setToken: (token) => set((state) => ({ ...state, token })),
        }),
        {
            name: 'auth-storage', // Tên key trong localStorage
            storage: createJSONStorage(() => localStorage), // Sử dụng localStorage
        },
    ),
);
