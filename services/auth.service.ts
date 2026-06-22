import api from "@/lib/axios/axios";
import { CurrentUser, RefreshTokenResponse } from "@/lib/constants/constants";
import { useAuthStore } from "@/store/auth.store";

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const { data } = await api.post<RefreshTokenResponse>(
    "/auth/refresh",
    {},
    { public: true, timeout: 10_000 },
  );
  return data;
};

export const getMe = async (): Promise<CurrentUser> => {
  const { data } = await api.post<CurrentUser>("/auth/me");
  return data;
};

export const completeAuthSession = async (
  accessToken: string,
): Promise<{ accessToken: string; user: CurrentUser }> => {
  useAuthStore.getState().setAccessToken(accessToken);
  const user = await getMe();
  return { accessToken, user };
};
