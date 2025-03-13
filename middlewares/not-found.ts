import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export async function notFoundMiddleware(req: Request, res: Response) {
	const path = req.path
	res.status(StatusCodes.NOT_FOUND).json({
		path,
		message: "Not found",
	})
}
