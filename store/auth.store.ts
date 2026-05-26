import { CurrentUser } from "@/lib/constants/constants";
import { create } from "zustand";



interface AuthState {
  status: "loading" | "guest" | "authenticated";
  user: CurrentUser | null;
  accessToken: string | null;
  setAuth: (data: { user: CurrentUser; accessToken: string }) => void;
  clearAuth: () => void;
  setLoading: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "loading",
  user: null,
  accessToken: null,
  setAuth: ({ user, accessToken }) =>
    set({
      status: "authenticated",
      user,
      accessToken,
    }),
  clearAuth: () =>
    set({
      status: "guest",
      user: null,
      accessToken: null,
    }),
  setLoading: () =>
    set({
      status: "loading",
    }),
}));
