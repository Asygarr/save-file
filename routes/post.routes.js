import {
  getAllPost,
  createPost,
  deletePost,
} from "../controllers/PostController.js";
import { checkAuth } from "../middleware/CheckAuth.js";
import { Router } from "express";
import upload from "../config/PostImage.js";

const route = Router();

route.get("/post", checkAuth, getAllPost);
route.post("/post", checkAuth, upload.array("image", 5), createPost);
route.delete("/post/:id", checkAuth, deletePost);

export default route;
