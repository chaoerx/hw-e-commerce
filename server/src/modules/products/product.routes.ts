import { Router } from "express";
import { asyncHandler } from "../../core/utils/async-handler";
import {
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
} from "./product.controller";

const router = Router();

router.get("/", asyncHandler(getProducts));
router.get("/categories", asyncHandler(getCategories));
router.get("/category/:category", asyncHandler(getProductsByCategory));
router.get("/:id", asyncHandler(getProductById));

export default router;
