import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../auth/context/AuthContext";
import { getUser, updateUser } from "../api/user.api";
import type { UpdateUserInput } from "../types/user.types";
import { userKeys } from "./userKeys";

export const useUser = (userId: number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUser(userId),
    enabled: isAuthenticated && userId > 0,
  });
};

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();
  const { updateAuthUser } = useAuth();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(userId, input),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      updateAuthUser({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        gender: updatedUser.gender,
        image: updatedUser.image,
      });
    },
  });
};
