import type { Product } from "../types/product.types";

export const getDiscountedPrice = (product: Product) =>
  product.price * (1 - product.discountPercentage / 100);

export const hasDiscount = (product: Product) =>
  product.discountPercentage > 0;
