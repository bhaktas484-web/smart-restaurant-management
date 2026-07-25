import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "CUSTOMER" | "WAITER" | "CHEF" | "CASHIER" | "MANAGER" | "ADMIN";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
}

// Persisted to localStorage so a page refresh doesn't log the user out.
// Only the access token + minimal profile are stored — never the refresh
// token, which stays in the httpOnly cookie set by the backend.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, accessToken) => set({ user, accessToken }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    { name: "restaurant-auth" }
  )
);