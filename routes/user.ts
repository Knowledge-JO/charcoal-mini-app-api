import express from "express"
import { createUser, getUser, getUsers, loginUser } from "../controllers/user"
import { authMiddleware } from "../middlewares"

const router = express.Router()

router.route("/users").post(createUser).get(getUsers)
router.post("/login", loginUser)
router.get("/users/:id", authMiddleware, getUser)

export default router
