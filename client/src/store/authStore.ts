import { create } from 'zustand';
import { authAPI } from '../lib/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: true,
    isAuthenticated: false,

    login: async (email: string, password: string) => {
        const response = await authAPI.login({ email, password });
        const { token, ...user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        set({ user, token, isAuthenticated: true });
    },

    register: async (name: string, email: string, password: string) => {
        const response = await authAPI.register({ name, email, password });
        const { token, ...user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
        }

        try {
            const response = await authAPI.getMe();
            set({
                user: response.data,
                token,
                isAuthenticated: true,
                isLoading: false
            });
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    }
}));
