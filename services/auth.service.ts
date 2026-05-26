
import api from "@/lib/axios/axios";
import { CurrentUser } from "@/store/auth.store";

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
