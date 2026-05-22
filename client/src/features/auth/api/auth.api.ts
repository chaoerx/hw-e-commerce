import axiosClient from "../../../lib/axiosClient";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "../types/auth.types";

export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const { data } = await axiosClient.post<LoginResponse>("/auth/login", {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: credentials.expiresInMins ?? 60,
  });
  return data;
};

export const getMe = async (): Promise<AuthUser> => {
  const { data } = await axiosClient.get<AuthUser>("/auth/me");
  return data;
};
