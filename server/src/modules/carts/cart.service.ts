import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../core/errors";
import { productService } from "../products/product.service";
import type { Product } from "../products/types";
import type {
  AddCartItemInput,
  Cart,
  CartListQueryParams,
  CartProduct,
  CartsListResponse,
  CreateCartInput,
  UpdateCartInput,
} from "./types";

const getDiscountedUnitPrice = (product: Product): number =>
  product.price * (1 - product.discountPercentage / 100);

const buildCartProduct = (product: Product, quantity: number): CartProduct => {
  const unitDiscounted = getDiscountedUnitPrice(product);

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

const recalculateCart = (
  cart: Omit<
    Cart,
    "total" | "discountedTotal" | "totalProducts" | "totalQuantity"
  >,
): Cart => {
  const { products } = cart;

  return {
    ...cart,
    total: products.reduce((sum, item) => sum + item.total, 0),
    discountedTotal: products.reduce(
      (sum, item) => sum + item.discountedTotal,
      0,
    ),
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, item) => sum + item.quantity, 0),
  };
};

const seedCarts = (): Cart[] => {
  const prd1 = productService.getProductById(1);
  const prd2 = productService.getProductById(2);
  const prd5 = productService.getProductById(5);

  return [
    recalculateCart({
      id: 1,
      userId: 1,
      products: [
        buildCartProduct(prd1, 2),
        buildCartProduct(prd2, 1),
      ],
    }),
    recalculateCart({
      id: 2,
      userId: 2,
      products: [buildCartProduct(prd5, 1)],
    }),
  ];
};

export class CartService {
  private carts: Cart[];
  private nextId: number;

  constructor(initialCarts: Cart[] = seedCarts()) {
    this.carts = initialCarts;
    this.nextId =
      initialCarts.length > 0
        ? Math.max(...initialCarts.map((cart) => cart.id)) + 1
        : 1;
  }

  private validateListParams(params: CartListQueryParams): void {
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

  private parseId(id: number, label = "cart"): number {
    if (!Number.isFinite(id)) {
      throw new BadRequestError(`Invalid ${label} id`);
    }
    return id;
  }

  private parseUserId(userId: number): number {
    if (!Number.isFinite(userId)) {
      throw new BadRequestError("Invalid user id");
    }
    return userId;
  }

  private findCartById(id: number): Cart {
    const cart = this.carts.find((item) => item.id === id);

    if (!cart) {
      throw new NotFoundError(`Cart with id ${id} not found`);
    }

    return cart;
  }

  private findCartByUserId(userId: number): Cart | undefined {
    return this.carts.find((cart) => cart.userId === userId);
  }

  private assertUserHasNoCart(userId: number): void {
    if (this.findCartByUserId(userId)) {
      throw new ConflictError(`User ${userId} already has a cart`);
    }
  }

  private buildProductsFromInput(
    items: Array<{ productId: number; quantity: number }>,
  ): CartProduct[] {
    return items.map(({ productId, quantity }) => {
      if (!Number.isFinite(productId)) {
        throw new BadRequestError("Invalid product id");
      }

      if (!Number.isFinite(quantity) || quantity < 1) {
        throw new BadRequestError("Quantity must be at least 1");
      }

      const product = productService.getProductById(productId);
      return buildCartProduct(product, quantity);
    });
  }

  private mergeCartProducts(
    existing: CartProduct[],
    product: Product,
    quantity: number,
  ): CartProduct[] {
    const line = existing.find((item) => item.id === product.id);

    if (line) {
      return existing.map((item) =>
        item.id === product.id
          ? buildCartProduct(product, item.quantity + quantity)
          : item,
      );
    }

    return [...existing, buildCartProduct(product, quantity)];
  }

  private saveCart(
    cart: Omit<
      Cart,
      "total" | "discountedTotal" | "totalProducts" | "totalQuantity"
    >,
  ): Cart {
    const normalized = recalculateCart(cart);
    const index = this.carts.findIndex((item) => item.id === normalized.id);

    if (index === -1) {
      this.carts.push(normalized);
    } else {
      this.carts[index] = normalized;
    }

    return normalized;
  }

  getCarts(params: CartListQueryParams): CartsListResponse {
    this.validateListParams(params);

    const safeSkip = params.skip ?? 0;
    const safeLimit = params.limit ?? this.carts.length;
    const carts = this.carts.slice(safeSkip, safeSkip + safeLimit);

    return {
      carts,
      total: this.carts.length,
      skip: safeSkip,
      limit: safeLimit,
    };
  }

  getCartById(id: number): Cart {
    return this.findCartById(this.parseId(id));
  }

  getCartByUserId(userId: number): Cart {
    const cart = this.findCartByUserId(this.parseUserId(userId));

    if (!cart) {
      throw new NotFoundError(`Cart for user ${userId} not found`);
    }

    return cart;
  }

  createCart(input: CreateCartInput): Cart {
    const userId = this.parseUserId(input.userId);
    this.assertUserHasNoCart(userId);

    const products = input.products?.length
      ? this.buildProductsFromInput(input.products)
      : [];

    return this.saveCart({
      id: this.nextId++,
      userId,
      products,
    });
  }

  updateCart(id: number, input: UpdateCartInput): Cart {
    const cart = this.findCartById(this.parseId(id));

    if (!Array.isArray(input.products)) {
      throw new BadRequestError("Products array is required");
    }

    const products = this.buildProductsFromInput(input.products);
    return this.saveCart({ ...cart, products });
  }

  deleteCart(id: number): Cart {
    const cartId = this.parseId(id);
    const index = this.carts.findIndex((item) => item.id === cartId);

    if (index === -1) {
      throw new NotFoundError(`Cart with id ${cartId} not found`);
    }

    const [removed] = this.carts.splice(index, 1);
    return removed;
  }

  addCartItem(cartId: number, input: AddCartItemInput): Cart {
    const cart = this.findCartById(this.parseId(cartId));
    const productId = input.productId;
    const quantity = input.quantity ?? 1;

    if (!Number.isFinite(productId)) {
      throw new BadRequestError("Invalid product id");
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new BadRequestError("Quantity must be at least 1");
    }

    const product = productService.getProductById(productId);
    const products = this.mergeCartProducts(cart.products, product, quantity);

    return this.saveCart({ ...cart, products });
  }

  updateCartItem(
    cartId: number,
    productId: number,
    quantity: number,
  ): Cart {
    const cart = this.findCartById(this.parseId(cartId));

    if (!Number.isFinite(productId)) {
      throw new BadRequestError("Invalid product id");
    }

    if (!Number.isFinite(quantity) || quantity < 0) {
      throw new BadRequestError("Quantity must be zero or greater");
    }

    const line = cart.products.find((item) => item.id === productId);

    if (!line) {
      throw new NotFoundError(
        `Product ${productId} not found in cart ${cartId}`,
      );
    }

    if (quantity === 0) {
      const products = cart.products.filter((item) => item.id !== productId);
      return this.saveCart({ ...cart, products });
    }

    const product = productService.getProductById(productId);
    const products = cart.products.map((item) =>
      item.id === productId ? buildCartProduct(product, quantity) : item,
    );

    return this.saveCart({ ...cart, products });
  }

  removeCartItem(cartId: number, productId: number): Cart {
    const cart = this.findCartById(this.parseId(cartId));

    if (!Number.isFinite(productId)) {
      throw new BadRequestError("Invalid product id");
    }

    const line = cart.products.find((item) => item.id === productId);

    if (!line) {
      throw new NotFoundError(
        `Product ${productId} not found in cart ${cartId}`,
      );
    }

    const products = cart.products.filter((item) => item.id !== productId);
    return this.saveCart({ ...cart, products });
  }

  clearCart(cartId: number): Cart {
    const cart = this.findCartById(this.parseId(cartId));
    return this.saveCart({ ...cart, products: [] });
  }
}

export const cartService = new CartService();
