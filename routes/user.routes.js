import {
  getAllUsers,
  getUsersById,
  createUser,
  updateUser,
} from "../controllers/UserController.js";
import { Router } from "express";
import upload from "../config/UserImage.js";
import { checkAuth } from "../middleware/CheckAuth.js";

const router = Router();

router.get("/users", checkAuth, getAllUsers);
router.get("/users/:id", checkAuth, getUsersById);
router.post("/users", upload.single("image"), createUser);
router.put("/users/:id", checkAuth, upload.single("image"), updateUser);

export default router;
