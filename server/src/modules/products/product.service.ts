import { BadRequestError, NotFoundError } from "../../core/errors";
import rawProducts from "../../db/seed/products.json";
import type { Product, ProductQueryParams, ProductsListResponse } from "./types";

export class ProductService {
  private readonly products: Product[];

  constructor(initialProducts: Product[] = [...rawProducts]) {
    this.products = initialProducts;
  }

  private validateListParams(params: ProductQueryParams): void {
    if (
      params.limit !== undefined &&
      (!Number.isFinite(params.limit) || params.limit < 0)
    ) {
      throw new BadRequestError("Invalid limit parameter");
    }

    if (
      params.skip !== undefined &&
      (!Number.isFinite(params.skip) || params.skip < 0)
    ) {
      throw new BadRequestError("Invalid skip parameter");
    }
  }

  private filterProducts(
    items: Product[],
    { category, search }: Pick<ProductQueryParams, "category" | "search">,
  ): Product[] {
    let result = [...items];

    if (category) {
      result = result.filter((product) => product.category === category);
    }

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.brand?.toLowerCase().includes(query) ?? false),
      );
    }

    return result;
  }

  private paginate(
    filtered: Product[],
    skip?: number,
    limit?: number,
  ): ProductsListResponse {
    const safeSkip = skip ?? 0;
    const safeLimit = limit ?? filtered.length;

    const products = filtered.slice(safeSkip, safeSkip + safeLimit);

    return {
      products,
      total: filtered.length,
      skip: safeSkip,
      limit: safeLimit,
    };
  }

  getProducts(params: ProductQueryParams): ProductsListResponse {
    this.validateListParams(params);

    const filtered = this.filterProducts(this.products, params);

    return this.paginate(filtered, params.skip, params.limit);
  }

  getCategories(): string[] {
    return [...new Set(this.products.map((product) => product.category))].sort();
  }

  getProductById(id: number): Product {
    if (!Number.isFinite(id)) {
      throw new BadRequestError("Invalid product id");
    }

    const product = this.products.find((item) => item.id === id);

    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    return product;
  }

  getProductsByCategory(
    category: string,
    params: ProductQueryParams,
  ): ProductsListResponse {
    if (!category) {
      throw new BadRequestError("Category is required");
    }

    return this.getProducts({ ...params, category });
  }
}

export const productService = new ProductService();
