import { NextFunction, Request, Response } from "express"
import { CustomAPIError } from "../errors"
import { StatusCodes } from "http-status-codes"

export async function errorHandlerMiddleware(
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const path = req.path
	console.log(path)
	if (error instanceof CustomAPIError) {
		res.status(error.statusCode).json({ message: error.message })
		return
	}

	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
}
