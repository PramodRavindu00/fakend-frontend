import { refreshToken } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const SESSION_QUERY_KEY = ["session"] as const;

export const useSessionQuery = (enabled = false) =>
  useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: refreshToken,
    enabled,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
