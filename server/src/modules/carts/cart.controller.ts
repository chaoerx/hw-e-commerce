import type { Request, Response } from "express";
import { BadRequestError } from "../../core/errors";
import { cartService } from "./cart.service";
import type { CartListQueryParams } from "./types";

const getRouteParam = (
  value: string | string[] | undefined,
): string | undefined => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
};

const parseQueryParams = (req: Request): CartListQueryParams => {
  const { limit, skip } = req.query;
  const parsedLimit = limit !== undefined ? Number(limit) : undefined;
  const parsedSkip = skip !== undefined ? Number(skip) : undefined;

  return {
    limit: parsedLimit,
    skip: parsedSkip,
  };
};

export const getCarts = (req: Request, res: Response): void => {
  const params = parseQueryParams(req);
  const result = cartService.getCarts(params);
  res.json(result);
};

export const getCartByUserId = (req: Request, res: Response): void => {
  const userId = Number(getRouteParam(req.params.userId));

  if (!Number.isFinite(userId)) {
    throw new BadRequestError("Invalid user id");
  }

  const cart = cartService.getCartByUserId(userId);
  res.json(cart);
};

export const getCartById = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const cart = cartService.getCartById(id);
  res.json(cart);
};

export const createCart = (req: Request, res: Response): void => {
  const { userId, products } = req.body ?? {};

  if (userId === undefined) {
    throw new BadRequestError("userId is required");
  }

  const cart = cartService.createCart({ userId: Number(userId), products });
  res.status(201).json(cart);
};

export const updateCart = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const cart = cartService.updateCart(id, req.body);
  res.json(cart);
};

export const deleteCart = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const cart = cartService.deleteCart(id);
  res.json(cart);
};

export const addCartItem = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const cart = cartService.addCartItem(id, req.body);
  res.json(cart);
};

export const updateCartItem = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const productId = Number(getRouteParam(req.params.productId));
  const { quantity } = req.body ?? {};

  if (quantity === undefined) {
    throw new BadRequestError("quantity is required");
  }

  const cart = cartService.updateCartItem(id, productId, Number(quantity));
  res.json(cart);
};

export const removeCartItem = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const productId = Number(getRouteParam(req.params.productId));
  const cart = cartService.removeCartItem(id, productId);
  res.json(cart);
};

export const clearCart = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const cart = cartService.clearCart(id);
  res.json(cart);
};
