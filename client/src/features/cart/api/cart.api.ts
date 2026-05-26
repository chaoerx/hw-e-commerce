import { getProduct } from "../../products/api/products.api";
import type { Product } from "../../products/types/product.types";
import { getDiscountedPrice } from "../../products/utils/productPrice";
import type { AddCartItemInput, Cart, CartProduct } from "../types/cart.types";
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

const buildCartProduct = (product: Product, quantity: number): CartProduct => {
  const unitDiscounted = getDiscountedPrice(product);

  return {
    id: product.id,
    title: product.title,
    price: product.price,
    quantity,
    total: product.price * quantity,
    discountPercentage: product.discountPercentage,
    discountedTotal: unitDiscounted * quantity,
    thumbnail: product.thumbnail,
  };
};

const recalculateCart = (cart: Cart): Cart => {
  const products = cart.products;
  const total = products.reduce((sum, item) => sum + item.total, 0);
  const discountedTotal = products.reduce(
    (sum, item) => sum + item.discountedTotal,
    0,
  );

  return {
    ...cart,
    id: 0,
    products,
    total,
    discountedTotal,
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, item) => sum + item.quantity, 0),
  };
};

const persistCart = (userId: number, cart: Cart) => {
  const normalized = recalculateCart({ ...cart, userId });
  saveStoredCart(userId, normalized);
  return normalized;
};

export const normalizeCart = (cart: Cart): Cart => recalculateCart(cart);

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
  const product = await getProduct(productId);
  const existing = currentCart.products.find((item) => item.id === productId);

  const products = existing
    ? currentCart.products.map((item) =>
        item.id === productId
          ? buildCartProduct(product, item.quantity + quantity)
          : item,
      )
    : [...currentCart.products, buildCartProduct(product, quantity)];

  return persistCart(userId, { ...currentCart, products });
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

  if (nextQuantity <= 0) {
    const products = currentCart.products.filter((item) => item.id !== productId);
    return persistCart(userId, { ...currentCart, products });
  }

  const product = await getProduct(productId);
  const products = currentCart.products.map((item) =>
    item.id === productId ? buildCartProduct(product, nextQuantity) : item,
  );

  return persistCart(userId, { ...currentCart, products });
};

export const clearCart = async (userId: number): Promise<Cart> => {
  return persistCart(userId, createEmptyCart(userId));
};
