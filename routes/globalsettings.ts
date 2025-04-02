import express from "express"
import { authMiddleware } from "../middlewares"
import { globalSettings } from "../controllers/globalSettings"

const router = express.Router()

router.get("/globalsettings/:id", authMiddleware, globalSettings)

export default router
