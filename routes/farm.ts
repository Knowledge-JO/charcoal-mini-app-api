import express from "express"
import { dailyReward } from "../controllers/farm"
import { authMiddleware } from "../middlewares"

const router = express.Router()

router.post("/dailyreward/:id", authMiddleware, dailyReward)

export default router
