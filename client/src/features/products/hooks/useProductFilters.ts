import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductFilters, ProductUiFilters, ProductSortOption } from "../types/product.types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const parseRatings = (value: string | null): number[] => {
  if (!value) return [];
  const parts = value.split(",").map((v) => Number(v.trim()));
  return parts.filter((n) => Number.isFinite(n) && n >= 1 && n <= 5);
};

const parseSort = (value: string | null): ProductSortOption => {
  switch (value) {
    case "price_asc":
    case "price_desc":
    case "rating_desc":
    case "title_asc":
    case "title_desc":
    case "relevance":
      return value;
    default:
      return "relevance";
  }
};

const setOrDelete = (params: URLSearchParams, key: string, value?: string) => {
  if (!value) params.delete(key);
  else params.set(key, value);
};

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const ui = useMemo<ProductUiFilters>(() => {
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("q") || undefined;
    const minPrice = clamp(parseNumber(searchParams.get("minPrice"), 0), 0, 2000);
    const maxPrice = clamp(parseNumber(searchParams.get("maxPrice"), 2000), 0, 2000);
    const ratings = parseRatings(searchParams.get("ratings"));
    const onSale = searchParams.get("onSale") === "1";
    const sort = parseSort(searchParams.get("sort"));

    return {
      category,
      search,
      minPrice: Math.min(minPrice, maxPrice),
      maxPrice: Math.max(minPrice, maxPrice),
      ratings,
      onSale,
      sort,
    };
  }, [searchParams]);

  const apiFilters = useMemo<ProductFilters>(() => {
    const base: ProductFilters = {
      category: ui.category,
      search: ui.search,
      limit: 30,
      skip: 0,
    };

    // DummyJSON supports sortBy/order on /products (and generally on other product endpoints).
    switch (ui.sort) {
      case "title_asc":
        return { ...base, sortBy: "title", order: "asc" };
      case "title_desc":
        return { ...base, sortBy: "title", order: "desc" };
      case "price_asc":
        return { ...base, sortBy: "price", order: "asc" };
      case "price_desc":
        return { ...base, sortBy: "price", order: "desc" };
      case "rating_desc":
        return { ...base, sortBy: "rating", order: "desc" };
      case "relevance":
      default:
        return base;
    }
  }, [ui]);

  const setFilters = (patch: Partial<ProductUiFilters>) => {
    const next = new URLSearchParams(searchParams);

    if ("category" in patch) setOrDelete(next, "category", patch.category || "");
    if ("search" in patch) setOrDelete(next, "q", patch.search?.trim() || "");

    if ("minPrice" in patch) next.set("minPrice", String(patch.minPrice ?? 0));
    if ("maxPrice" in patch) next.set("maxPrice", String(patch.maxPrice ?? 2000));

    if ("ratings" in patch) {
      if (patch.ratings && patch.ratings.length > 0) {
        next.set("ratings", patch.ratings.join(","));
      } else {
        next.delete("ratings");
      }
    }

    if ("onSale" in patch) {
      if (patch.onSale) next.set("onSale", "1");
      else next.delete("onSale");
    }

    if ("sort" in patch) {
      const sort = patch.sort ?? "relevance";
      if (sort === "relevance") next.delete("sort");
      else next.set("sort", sort);
    }

    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    next.delete("q");
    next.delete("minPrice");
    next.delete("maxPrice");
    next.delete("ratings");
    next.delete("onSale");
    next.delete("sort");
    setSearchParams(next, { replace: true });
  };

  return { ui, apiFilters, setFilters, clearFilters };
};

