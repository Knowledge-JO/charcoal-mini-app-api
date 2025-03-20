import express from "express"
import {
	claimDailyReward,
	getDailyRewardData,
	multiTap,
	rechargeEnergy,
} from "../controllers/farm"
import { authMiddleware } from "../middlewares"

const router = express.Router()

router.post("/claimdailyreward/:id", authMiddleware, claimDailyReward)
router.get("/getdailyrewarddata/:id", authMiddleware, getDailyRewardData)
router.post("/tap/:id", authMiddleware, multiTap)
router.post("/refill/:id", rechargeEnergy)
export default router
