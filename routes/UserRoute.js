import {
  getAllUsers,
  getUsersById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import { Router } from "express";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUsersById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
