import { Router } from "express";
import { POSController } from "../controllers/posController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/verify-account", authMiddleware, POSController.verifyAccountNumber);
router.post("/process-transfer", authMiddleware, POSController.processTransfer);
router.get("/transactions", authMiddleware, POSController.getTransactions);

export default router;
