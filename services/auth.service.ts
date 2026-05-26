import api from "@/lib/axios/axios";
import { RefreshTokenResponse } from "@/lib/constants/constants";

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const { data } = await api.post<RefreshTokenResponse>(
    "/auth/refresh",
    {},
    { public: true },
  );
  return data;
};
