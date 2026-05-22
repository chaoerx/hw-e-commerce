import axiosClient from "../../../lib/axiosClient";
import type { UpdateUserInput, UserProfile } from "../types/user.types";

export const getUser = async (userId: number): Promise<UserProfile> => {
  const { data } = await axiosClient.get<UserProfile>(`/users/${userId}`);
  return data;
};

export const updateUser = async (
  userId: number,
  input: UpdateUserInput,
): Promise<UserProfile> => {
  const { data } = await axiosClient.put<UserProfile>(`/users/${userId}`, input);
  return data;
};
