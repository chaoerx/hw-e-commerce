import axiosClient from "../../../lib/axiosClient";
import type {
  Product,
  ProductFilters,
  ProductsResponse,
} from "../types/product.types";

export const getProducts = async (
  filters?: ProductFilters,
): Promise<ProductsResponse> => {
  const { data } = await axiosClient.get<ProductsResponse>("/products", {
    params: filters,
  });
  return data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const { data } = await axiosClient.get<Product>(`/products/${id}`);
  return data;
};

export const getCategories = async (): Promise<string[]> => {
  const { data } = await axiosClient.get<string[]>("/products/categories");
  return data;
};
