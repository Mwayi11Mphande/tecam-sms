import { create } from "zustand";
import * as authApi from "@/services/auth/auth.api";
import {
  setToken,
  getToken,
  removeToken,
} from "@/lib/auth/token";
import { AuthUser } from "@/lib/api/types";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;

  login: (email: string, password: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,

  // -----------------------------
  // LOGIN
  // -----------------------------
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await authApi.login({ email, password });

      setToken(res.token);

      set({
        user: res.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // -----------------------------
  // FETCH USER (on app load)
  // -----------------------------
  fetchUser: async () => {
    const token = getToken();

    // No token → not authenticated
    if (!token) {
      set({
        user: null,
        isAuthenticated: false,
        initialized: true,
      });
      return;
    }

    set({ loading: true });

    try {
      const user = await authApi.getMe();

      set({
        user,
        isAuthenticated: true,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      // Token invalid or expired
      removeToken();

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        initialized: true,
      });
    }
  },

  // -----------------------------
  // LOGOUT
  // -----------------------------
  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }

    removeToken();

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));