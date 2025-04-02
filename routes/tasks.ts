import express from "express"
import { completeTask, getTask, getTasks } from "../controllers/tasks"
import { authMiddleware } from "../middlewares"

const router = express.Router()

router.get("/:id", authMiddleware, getTasks)

router
	.route("/:id/:taskId")
	.post(authMiddleware, completeTask)
	.get(authMiddleware, getTask)

export default router
