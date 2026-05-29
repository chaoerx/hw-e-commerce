import { Router } from "express";
import { asyncHandler } from "../../core/utils/async-handler";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUsers,
  updateUser,
} from "./user.controller";

const router = Router();

router.get("/", asyncHandler(getUsers));
router.get("/by-email", asyncHandler(getUserByEmail));
router.get("/username/:username", asyncHandler(getUserByUsername));
router.post("/", asyncHandler(createUser));
router.get("/:id", asyncHandler(getUserById));
router.put("/:id", asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

export default router;
