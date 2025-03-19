import { create } from 'zustand';

type Role = 'student' | 'tutor' | 'admin' | null;

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
    setUser: (user: User) => void; // ✅ Thêm setUser để cập nhật user riêng lẻ
    setToken: (token: string) => void; // ✅ Thêm setToken để cập nhật token riêng lẻ
}

export const useAuthStore = create<AuthState>((set) => ({
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
    setUser: (user) => set((state) => ({ ...state, user })), // ✅ Thêm setUser
    setToken: (token) => set((state) => ({ ...state, token })), // ✅ Thêm setToken
}));
