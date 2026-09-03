import { Router } from "express";
import { POSController } from "../controllers/posController.js";
const router = Router();
router.post("/verify-account", POSController.verifyAccountNumber);
router.post("/process-transfer", POSController.processTransfer);
router.get("/transactions", POSController.getTransactions);
export default router;
