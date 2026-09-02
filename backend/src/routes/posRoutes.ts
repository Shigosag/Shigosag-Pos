import { Router } from "express";
import { POSController } from "../controllers/posController.js";
const router = Router();
router.post("/verify-account", POSController.verifyAccountNumber);
router.post("/process-transfer", POSController.processTransfer);
export default router;
