import { Router } from "express";
import { Login, Me, Logout } from "../controllers/auth/UserAuth.js";

const router = Router();

router.post("/login", Login);
router.get("/me", Me);
router.delete("/logout", Logout);

export default router;
