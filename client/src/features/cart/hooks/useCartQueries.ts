import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../auth/context/AuthContext";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
} from "../api/cart.api";
import { cartKeys } from "./cartKeys";
import type { AddCartItemInput } from "../types/cart.types";

export const useCart = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: cartKeys.byUser(user?.id ?? 0),
    queryFn: () => getCart(user!.id),
    enabled: isAuthenticated && Boolean(user),
  });
};

export const useAddCartItem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddCartItemInput) => addCartItem(user!.id, input),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.byUser(user!.id), cart);
    },
  });
};

export const useRemoveCartItem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => removeCartItem(user!.id, productId),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.byUser(user!.id), cart);
    },
  });
};

export const useClearCart = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCart(user!.id),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.byUser(user!.id), cart);
    },
  });
};
