import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Role = 'STUDENT' | 'TUTOR' | 'ADMIN' | null;

interface User {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    status?: string;
    violate?: number;
    gender?: string;
    dob?: string;
    address?: string;
    avatar?: string;
    role: Role;
    location?: string[];
    userProfile?: {
        idCardNumber?: string;
        avatar?: string;
        gender?: string;
        dob?: string;
        address?: string;
    };
    tutorProfile?: {
        hourlyPrice: number;
        level: string;
        experiences: number;
        taughtStudentsCount: number;
        rating: number;
        fee: number;
        description: string;
        tutorLocations: string[];
        specializations: string[];
        learningTypes: string[];
        reviews?: {
            avatar: string;
            name: string;
            date: string;
            content: string;
            rating: number;
        }[];
        isFavorite?: boolean;
        freeTime: string[];
        qualification: string;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean; // Added this property
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    resetAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false, // Default value for isAuthenticated
            login: (user, token) => {
                if (!user || !token) {
                    console.error('Lỗi đăng nhập: Thiếu user hoặc token');
                    return;
                }
                set({ user, token, isAuthenticated: true });
                console.log('[Zustand] User login success:', user);
            },
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
            setUser: (user) => set((state) => ({ ...state, user })),
            setToken: (token) => set((state) => ({ ...state, token })),
            resetAuth: () => {
                localStorage.removeItem('auth-storage');
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            version: 3,
            migrate: async (persistedState, version) => {
                console.log('[zustand migrate] Old version:', version);

                // Nếu object không hợp lệ, return fallback
                if (typeof persistedState !== 'object' || persistedState === null) {
                    return {
                        user: null,
                        token: null,
                    };
                }

                // Ép kiểu rõ ràng để TypeScript khỏi méo mặt
                const state = persistedState as AuthState;
                const user = state.user;

                if (version < 2 && user) {
                    return {
                        ...state,
                        user: {
                            ...user,
                            userProfile: {
                                idCardNumber: '',
                                avatar: '',
                                gender: '',
                                dob: '',
                                address: '',
                                ...(user.userProfile ?? {}),
                            },
                            tutorProfile: {
                                hourlyPrice: 0,
                                level: '',
                                experiences: 0,
                                taughtStudentsCount: 0,
                                rating: 0,
                                fee: 0,
                                description: '',
                                tutorLocations: [],
                                specializations: [],
                                learningTypes: [],
                                freeTime: [],
                                qualification: '',
                                ...(user.tutorProfile ?? {}),
                            },
                        },
                    };
                }

                return state;
            },
        },
    ),
);
