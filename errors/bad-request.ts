import { StatusCodes } from "http-status-codes"
import { CustomAPIError } from "./custom-error"

export class BadRequestAPIError extends CustomAPIError {
	constructor(message: string) {
		super(message, StatusCodes.BAD_REQUEST)
	}
}
