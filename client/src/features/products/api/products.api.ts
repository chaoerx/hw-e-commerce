import axiosClient from "../../../lib/axiosClient";
import type {
  Product,
  ProductFilters,
  ProductsResponse,
} from "../types/product.types";

export const getProducts = async (
  filters?: ProductFilters,
): Promise<ProductsResponse> => {
  const { category, search, limit, skip } = filters ?? {};

  if (search) {
    const { data } = await axiosClient.get<ProductsResponse>(
      "/products/search",
      { params: { q: search, limit, skip } },
    );
    return data;
  }

  if (category) {
    const { data } = await axiosClient.get<ProductsResponse>(
      `/products/category/${category}`,
      { params: { limit, skip } },
    );
    return data;
  }

  const { data } = await axiosClient.get<ProductsResponse>("/products", {
    params: { limit, skip },
  });
  return data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const { data } = await axiosClient.get<Product>(`/products/${id}`);
  return data;
};

export const getCategories = async (): Promise<string[]> => {
  const { data } = await axiosClient.get<string[]>("/products/category-list");
  return data;
};
