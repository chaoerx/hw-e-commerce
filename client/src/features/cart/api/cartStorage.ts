import type { Cart } from "../types/cart.types";

const cartKey = (userId: number) => `cart_${userId}`;

export const loadStoredCart = (userId: number): Cart | null => {
  const raw = localStorage.getItem(cartKey(userId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Cart;
  } catch {
    return null;
  }
};

export const saveStoredCart = (userId: number, cart: Cart) => {
  localStorage.setItem(cartKey(userId), JSON.stringify(cart));
};

export const clearStoredCart = (userId: number) => {
  localStorage.removeItem(cartKey(userId));
};
