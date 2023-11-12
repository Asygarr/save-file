import {
  getAllUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import { Router } from "express";
import upload from "../config/UserImage.js";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUsersById);
router.post("/users", upload.single("img_profile"), createUser);
router.put("/users/:id", upload.single("img_profile"), updateUser);
router.delete("/users/:id", deleteUser);

export default router;
