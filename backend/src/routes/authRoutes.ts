import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.delete("/delete-account", authMiddleware, AuthController.deleteAccount);

export default router;
