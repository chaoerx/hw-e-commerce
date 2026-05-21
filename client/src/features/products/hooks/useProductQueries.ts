import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getProduct,
  getProducts,
} from "../api/products.api";
import { productKeys } from "./productKeys";
import type { ProductFilters } from "../types/product.types";

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProducts(filters),
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: getCategories,
  });
};
