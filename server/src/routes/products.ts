import { Router } from "express";
import rawProducts from "../db/seed/products.json";

type Product = (typeof rawProducts)[number];

const router = Router();

router.get("/categories", (_req, res) => {
  const categories = [...new Set(rawProducts.map((p) => p.category))].sort();
  res.json(categories);
});

router.get("/", (req, res) => {
  const { category, search, limit, skip } = req.query;

  let products: Product[] = [...rawProducts];

  if (typeof category === "string" && category.length > 0) {
    products = products.filter((p) => p.category === category);
  }

  if (typeof search === "string" && search.length > 0) {
    const query = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.brand?.toLowerCase().includes(query) ?? false),
    );
  }

  const total = products.length;
  const skipNum = skip ? Number(skip) : 0;
  const limitNum = limit ? Number(limit) : products.length;

  products = products.slice(skipNum, skipNum + limitNum);

  res.json({ products, total });
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = rawProducts.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.json(product);
});

export default router;
