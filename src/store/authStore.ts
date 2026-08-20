import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/api/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  markOnboardingCompleted: () => void;
}

// 전역 상태: 로그인 사용자 정보 (여러 화면에서 공유되는 값이라 zustand + localStorage persist)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      markOnboardingCompleted: () =>
        set((state) => (state.user ? { user: { ...state.user, onboardingCompleted: true } } : {})),
    }),
    { name: "welli-auth" },
  ),
);
