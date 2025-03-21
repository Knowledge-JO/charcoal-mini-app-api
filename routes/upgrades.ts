import express from "express"
import { upgrade } from "../controllers/upgrades"
import { authMiddleware } from "../middlewares"

const router = express.Router()

router.post("/:id/:upgrade", authMiddleware, upgrade)

export default router
