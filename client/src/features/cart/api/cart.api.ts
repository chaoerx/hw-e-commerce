import axiosClient from "../../../lib/axiosClient";
import type {
  AddCartItemInput,
  Cart,
  CartProduct,
  UpdateCartProductInput,
} from "../types/cart.types";
import { loadStoredCart, saveStoredCart } from "./cartStorage";

const createEmptyCart = (userId: number): Cart => ({
  id: 0,
  products: [],
  total: 0,
  discountedTotal: 0,
  userId,
  totalProducts: 0,
  totalQuantity: 0,
});

const normalizeCartProduct = (product: CartProduct): CartProduct => ({
  ...product,
  discountedTotal:
    product.discountedTotal ??
    (product as CartProduct & { discountedPrice?: number }).discountedPrice ??
    product.total,
});

export const normalizeCart = (cart: Cart): Cart => {
  const products = cart.products.map(normalizeCartProduct);

  return {
    ...cart,
    products,
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, item) => sum + item.quantity, 0),
  };
};

const persistCart = (userId: number, cart: Cart) => {
  const normalized = normalizeCart({ ...cart, userId });
  saveStoredCart(userId, normalized);
  return normalized;
};

export const getCart = async (userId: number): Promise<Cart> => {
  const stored = loadStoredCart(userId);
  if (stored) return normalizeCart(stored);

  return createEmptyCart(userId);
};

export const addCartItem = async (
  userId: number,
  { productId, quantity = 1 }: AddCartItemInput,
): Promise<Cart> => {
  const currentCart = await getCart(userId);
  const existingItem = currentCart.products.find((item) => item.id === productId);
  const updatedQuantity = (existingItem?.quantity ?? 0) + quantity;

  const payload: UpdateCartProductInput[] = [
    { id: productId, quantity: updatedQuantity },
  ];

  if (currentCart.products.length === 0) {
    const { data } = await axiosClient.post<Cart>("/carts/add", {
      userId,
      products: payload,
    });
    return persistCart(userId, data);
  }

  const { data } = await axiosClient.put<Cart>(`/carts/${currentCart.id}`, {
    merge: true,
    products: payload,
  });

  return persistCart(userId, data);
};

export const removeCartItem = async (
  userId: number,
  productId: number,
): Promise<Cart> => {
  const currentCart = await getCart(userId);
  const target = currentCart.products.find((item) => item.id === productId);

  if (!target) {
    return currentCart;
  }

  const nextQuantity = target.quantity - 1;

  const products: UpdateCartProductInput[] =
    nextQuantity > 0
      ? currentCart.products.map((item) =>
          item.id === productId
            ? { id: item.id, quantity: nextQuantity }
            : { id: item.id, quantity: item.quantity },
        )
      : currentCart.products
          .filter((item) => item.id !== productId)
          .map((item) => ({ id: item.id, quantity: item.quantity }));

  if (products.length === 0) {
    return clearCart(userId);
  }

  if (currentCart.id === 0) {
    const { data } = await axiosClient.post<Cart>("/carts/add", {
      userId,
      products,
    });
    return persistCart(userId, data);
  }

  const { data } = await axiosClient.put<Cart>(`/carts/${currentCart.id}`, {
    merge: false,
    products,
  });

  return persistCart(userId, data);
};

export const clearCart = async (userId: number): Promise<Cart> => {
  const currentCart = await getCart(userId);

  if (currentCart.id > 0) {
    try {
      await axiosClient.delete(`/carts/${currentCart.id}`);
    } catch {
      // DummyJSON may reject delete; still clear local state.
    }
  }

  return persistCart(userId, createEmptyCart(userId));
};
