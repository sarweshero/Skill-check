import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAuth: (token: string, user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    updateUser: (user: Partial<User>) => void;
}

// Decode JWT to extract user info
const decodeToken = (token: string): Partial<User> | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,

            setAuth: (token: string, user: User) => {
                localStorage.setItem('token', token);
                set({
                    token,
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            updateUser: (userData: Partial<User>) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                }));
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Hook to check if user has admin role
export const useIsAdmin = () => {
    const user = useAuthStore((state) => state.user);
    return user?.role === 'ADMIN';
};

// Hook to check if user has student role
export const useIsStudent = () => {
    const user = useAuthStore((state) => state.user);
    return user?.role === 'STUDENT';
};

export { decodeToken };
