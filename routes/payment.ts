import express from "express"
import { authMiddleware } from "../middlewares"
import {
	createInvoice,
	getPaymentReceipt,
	updateInvoiceStatus,
} from "../controllers/payment"

const router = express.Router()

router.post("/create_invoice/:id", authMiddleware, createInvoice)
router.patch("/update_invoice/:id", authMiddleware, updateInvoiceStatus)
router.get("/receipt/:id", authMiddleware, getPaymentReceipt)
export default router
