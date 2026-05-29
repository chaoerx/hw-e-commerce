import type { Request, Response } from "express";
import { BadRequestError } from "../../core/errors";
import { productService } from "./product.service";
import type { ProductQueryParams } from "./types";

const getRouteParam = (
  value: string | string[] | undefined,
): string | undefined => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
};

const parseQueryParams = (req: Request): ProductQueryParams => {
  const { category, search, limit, skip } = req.query;

  const parsedLimit = limit !== undefined ? Number(limit) : undefined;
  const parsedSkip = skip !== undefined ? Number(skip) : undefined;

  return {
    category: typeof category === "string" ? category : undefined,
    search: typeof search === "string" ? search : undefined,
    limit: parsedLimit,
    skip: parsedSkip,
  };
};

export const getProducts = (req: Request, res: Response): void => {
  const params = parseQueryParams(req);
  const result = productService.getProducts(params);
  res.json(result);
};

export const getCategories = (_req: Request, res: Response): void => {
  const categories = productService.getCategories();
  res.json(categories);
};

export const getProductById = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const product = productService.getProductById(id);
  res.json(product);
};

export const getProductsByCategory = (req: Request, res: Response): void => {
  const category = getRouteParam(req.params.category);

  if (!category) {
    throw new BadRequestError("Category is required");
  }

  const params = parseQueryParams(req);
  const result = productService.getProductsByCategory(category, params);
  res.json(result);
};
