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
}

export interface ProductsListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  limit?: number;
  skip?: number;
}
