import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, signInUser } from "@/lib/utils";
import { getAccessToken, getUser } from "@/services/user-api";
import { useTelegram } from "@/hooks/use-telegram";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  handleTelegramAuth: () => void;
  user: any;
  setUser: (user: any) => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // We don't use telegram auth on locale environment
  const [user, setUser] = useState<any>(null);
  const isDevelopment = import.meta.env.DEV;
  const [isLoggedIn, setIsLoggedIn] = useState(
    !isDevelopment ? false : isAuthenticated()
  );
  const navigate = useNavigate();
  const telegram = useTelegram();
  const [isLoading, setIsLoading] = useState(false);

  // use react query to fetch user
  const {
    data: userData,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: false,
  });

  useEffect(() => {
    if (isLoggedIn && !isUserLoading) {
      refetchUser();
      setUser(userData);
    }
  }, [isLoggedIn, isUserLoading, refetchUser]);

  const handleTelegramAuth = useCallback(async () => {
    if (isDevelopment) return;
    if (!telegram) return;

    try {
      let authData;

      authData = await getAccessToken({
        tgWebAppData: telegram.initData,
      });

      if (authData?.token) {
        await signInUser(authData.token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error parsing URL data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [telegram, isDevelopment]);

  useEffect(() => {
    setIsLoading(true);
    handleTelegramAuth();
  }, [handleTelegramAuth, navigate, telegram]);

  const value = useMemo(
    () => ({
      isAuthenticated: isLoggedIn,
      isLoading,
      handleTelegramAuth,
      user,
      setUser,
      refetchUser,
    }),
    [isLoggedIn, isLoading, handleTelegramAuth, user, refetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
