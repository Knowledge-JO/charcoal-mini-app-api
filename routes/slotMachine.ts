import express from "express"
import { authMiddleware } from "../middlewares"
import { playSlotMachine } from "../controllers/slotMachine"

const router = express.Router()

router.post("/playslotmachine/:id", authMiddleware, playSlotMachine)

export default router
