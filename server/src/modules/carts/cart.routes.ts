import { Router } from "express";
import { asyncHandler } from "../../core/utils/async-handler";
import {
  addCartItem,
  clearCart,
  createCart,
  deleteCart,
  getCartById,
  getCartByUserId,
  getCarts,
  removeCartItem,
  updateCart,
  updateCartItem,
} from "./cart.controller";

const router = Router();

router.get("/", asyncHandler(getCarts));
router.get("/user/:userId", asyncHandler(getCartByUserId));
router.post("/", asyncHandler(createCart));
router.get("/:id", asyncHandler(getCartById));
router.put("/:id", asyncHandler(updateCart));
router.delete("/:id", asyncHandler(deleteCart));

router.post("/:id/items", asyncHandler(addCartItem));
router.patch("/:id/items/:productId", asyncHandler(updateCartItem));
router.delete("/:id/items/:productId", asyncHandler(removeCartItem));
router.delete("/:id/items", asyncHandler(clearCart));

export default router;
