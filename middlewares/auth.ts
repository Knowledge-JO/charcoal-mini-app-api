import { Request, Response, NextFunction } from "express"
import {
	CustomAPIError,
	NotFoundAPIError,
	UnauthenticatedAPIError,
} from "../errors"
import jwt from "jsonwebtoken"
import User from "../models/user"

interface IPayload extends jwt.JwtPayload {
	userId: number
	name: string
}

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const headers = req.headers
	const auth = headers.authorization

	const params = req.params

	if (!auth || !auth.startsWith("Bearer ")) {
		throw new UnauthenticatedAPIError("Invalid token")
	}

	const token = auth.replace("Bearer ", "")

	const secret = process.env.JWT_SECRET

	if (!secret) {
		throw new Error("server error")
	}

	jwt.verify(token, secret, {}, (err, payload) => {
		if (err) {
			throw new UnauthenticatedAPIError(err.message)
		}

		if (payload) {
			const pl = payload as IPayload

			const userId = pl.userId

			User.findOne({ telegramId: params.id })
				.then((user) => {
					if (!user) {
						throw new NotFoundAPIError("user not found")
					}

					if (userId !== Number(params.id)) {
						throw new UnauthenticatedAPIError("Not authorized")
					}

					next()
				})
				.catch((err) => {
					if (err instanceof CustomAPIError) {
						res.status(err.statusCode).json({ message: err.message })
						return
					}

					throw new Error(err)
				})
		}
	})
}
