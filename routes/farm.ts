import express from "express"
import {
	claimDailyReward,
	getDailyRewardData,
	multiTap,
	rechargeCharcoalTurbo,
	rechargeEnergy,
	startCharcoalTurbo,
} from "../controllers/farm"
import { authMiddleware } from "../middlewares"

const router = express.Router()

router.post("/claimdailyreward/:id", authMiddleware, claimDailyReward)
router.get("/getdailyrewarddata/:id", authMiddleware, getDailyRewardData)
router.post("/tap/:id", authMiddleware, multiTap)
router.post("/refill/:id", rechargeEnergy)
router.post("/turbo/:id", authMiddleware, startCharcoalTurbo)
router.post("/rechargeturbo/:id", authMiddleware, rechargeCharcoalTurbo)
export default router
