import { create } from 'zustand';
import type { User } from '@/types/auth';
import { API_ROUTES } from '@/constants/api';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

let hydrateController: AbortController | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,

  login: async (email, password) => {
    hydrateController?.abort();
    try {
      const res = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        set({ isLoggedIn: true, user: data.user, isLoading: false });
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch {
      return { success: false, error: '네트워크 오류가 발생했습니다.' };
    }
  },

  logout: async () => {
    hydrateController?.abort();
    await fetch(API_ROUTES.AUTH.LOGOUT, { method: 'POST' });
    set({ isLoggedIn: false, user: null });
  },

  hydrate: async () => {
    hydrateController?.abort();
    const controller = new AbortController();
    hydrateController = controller;

    try {
      const res = await fetch(API_ROUTES.AUTH.ME, { signal: controller.signal });
      if (controller.signal.aborted) return;
      if (res.ok) {
        const data = await res.json();
        set({
          isLoggedIn: data.authenticated,
          user: data.user,
          isLoading: false,
        });
      } else {
        set({ isLoggedIn: false, user: null, isLoading: false });
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      set({ isLoggedIn: false, user: null, isLoading: false });
    }
  },
}));
