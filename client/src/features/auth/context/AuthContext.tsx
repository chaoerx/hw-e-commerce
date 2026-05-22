import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { clearStoredCart } from "../../cart/api/cartStorage";
import { getMe, login as loginApi } from "../api/auth.api";
import type { AuthUser, LoginCredentials } from "../types/auth.types";
import {
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_USER_KEY,
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  persistAuth,
} from "./authStorage";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateAuthUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const toAuthUser = ({
  id,
  username,
  email,
  firstName,
  lastName,
  gender,
  image,
}: AuthUser): AuthUser => ({
  id,
  username,
  email,
  firstName,
  lastName,
  gender,
  image,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      clearStoredCart(storedUser.id);
    }
    clearAuthStorage();
    setUser(null);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginApi(credentials);
    const authUser = toAuthUser(response);

    persistAuth(response.accessToken, response.refreshToken, authUser);
    setUser(authUser);
  }, []);

  const updateAuthUser = useCallback((authUser: AuthUser) => {
    const token = getStoredToken();
    const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);

    if (token && refreshToken) {
      persistAuth(token, refreshToken, authUser);
    }

    setUser(authUser);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (!token || !storedUser) {
        setIsLoading(false);
        return;
      }

      setUser(storedUser);

      try {
        const currentUser = await getMe();
        setUser(toAuthUser(currentUser));
        localStorage.setItem(
          AUTH_USER_KEY,
          JSON.stringify(toAuthUser(currentUser)),
        );
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      updateAuthUser,
    }),
    [user, isLoading, login, logout, updateAuthUser],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
