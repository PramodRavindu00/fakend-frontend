import type { CurrentUser } from "@/context/auth.context";
import api from "@/utils/axios/axios";

export const refresh = async (): Promise<{
  user: CurrentUser;
  accessToken: string;
}> => {
  const { data } = await api.post<{ user: CurrentUser; accessToken: string }>(
    "/auth/refresh",
    {},
    { public: true },
  );
  return data;
};
