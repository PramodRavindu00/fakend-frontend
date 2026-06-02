import { AuthStatus, CurrentUser } from "@/lib/constants/constants";
import { create } from "zustand";

interface AuthState {
  status: AuthStatus;
  user: CurrentUser | null;
  accessToken: string | null;
  setAuth: (data: { user: CurrentUser; accessToken: string }) => void;
  clearAuth: () => void;
  setLoading: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: AuthStatus.Loading,
  user: null,
  accessToken: null,
  setAuth: ({ user, accessToken }) =>
    set({
      status: AuthStatus.Authenticated,
      user,
      accessToken,
    }),
  clearAuth: () =>
    set({
      status: AuthStatus.Guest,
      user: null,
      accessToken: null,
    }),
  setLoading: () =>
    set({
      status: AuthStatus.Loading,
    }),
}));
