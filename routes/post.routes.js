import {
  getAllPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/PostController.js";
import { checkAuth } from "../middleware/CheckAuth.js";
import { Router } from "express";
import upload from "../config/PostImage.js";

const route = Router();

route.get("/post", checkAuth, getAllPost);
route.get("/post/:id", checkAuth, getPostById);
route.put("/post/:id", checkAuth, upload.array("image", 5), updatePost);
route.post("/post", checkAuth, upload.array("image", 5), createPost);
route.delete("/post/:id", checkAuth, deletePost);

export default route;
