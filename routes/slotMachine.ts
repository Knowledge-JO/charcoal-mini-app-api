import express from "express"
import { authMiddleware } from "../middlewares"
import { playSlotMachine, slotItems } from "../controllers/slotMachine"

const router = express.Router()

router.get("/slotitems/:id", authMiddleware, slotItems)
router.post("/playslotmachine/:id", authMiddleware, playSlotMachine)

export default router
