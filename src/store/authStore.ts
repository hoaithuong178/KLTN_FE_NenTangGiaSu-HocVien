import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Role = 'STUDENT' | 'TUTOR' | 'ADMIN' | null;

interface User {
    id: number;
    id: string;
    name: string;
    phone?: string;
    email: string;
    name: string;
    role: Role;
    avatar?: string;
    location?: string[];
    userProfile?: {
        email: string;
        phone: string;
        avatar: string;
        gender: string;
        dob: string;
    };
    tutorProfile?: {
        hourlyPrice: number;
        level: string;
        experiences: number;
        taughtStudentsCount: number;
        rating: number;
        description: string;
        learningTypes: string[];
        specializations: string[];
        tutorLocations: string[];
    };
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
