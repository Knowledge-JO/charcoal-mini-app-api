import express from "express"
import { createUser, getUser, getUsers } from "../controllers/user"
import { authMiddleware } from "../middlewares"

const router = express.Router()

router.route("/users").post(createUser).get(getUsers)
router.get("/users/:id", authMiddleware, getUser)

export default router
