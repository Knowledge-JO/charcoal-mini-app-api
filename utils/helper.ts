import jwt from "jsonwebtoken"
import { BadRequestAPIError } from "../errors"

function createJWT(id: string, name: string) {
	const secret = process.env.JWT_SECRET
	if (!secret) throw new BadRequestAPIError("no secret token")

	return jwt.sign({ userId: id, name }, secret, { expiresIn: "1d" })
}

function timeInSec(addHrs = 0) {
	const inSecs = addHrs * 3600
	const secs = Date.now() / 1000

	return secs + inSecs
}

export { timeInSec, createJWT }
