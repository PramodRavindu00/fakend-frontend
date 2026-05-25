import { refresh } from "@/services/auth.service";
import { createContext, useEffect, useState } from "react";

export interface CurrentUser {
  id: string;
}
interface AuthState {
  status: "loading" | "guest" | "authenticated";
  user: CurrentUser | null;
  accessToken: string | null;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    status: "loading",
    user: null,
    accessToken: null,
  });

  useEffect(() => {
    const authenticate = async () => {
      try {
        const { accessToken, user } = await refresh();
        setAuthState({ status: "authenticated", user, accessToken });
      } catch (error) {
        console.error(error);

        setAuthState({ status: "guest", user: null, accessToken: null });
      }
    };
    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
