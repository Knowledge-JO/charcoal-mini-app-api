import express from "express"
import { authMiddleware } from "../middlewares"
import {
	buyAndUpgradePotionCard,
	getPotionCards,
	getUserLevel,
} from "../controllers/potionSettings"

const router = express.Router()

router.get("/:id", authMiddleware, getPotionCards)
router.post(
	"/buyandupgrade/:id/:cardId",
	authMiddleware,
	buyAndUpgradePotionCard
)
router.get("/lvl/:id", authMiddleware, getUserLevel)
export default router
