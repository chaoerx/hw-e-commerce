export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images?: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  limit?: number;
  skip?: number;
  sortBy?: "title" | "price" | "rating";
  order?: "asc" | "desc";
}

export type ProductSortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "title_asc"
  | "title_desc";

export interface ProductUiFilters {
  category?: string;
  search?: string;
  minPrice: number;
  maxPrice: number;
  ratings: number[]; // e.g. [4,3] means 4+ or 3+
  onSale: boolean;
  sort: ProductSortOption;
}
