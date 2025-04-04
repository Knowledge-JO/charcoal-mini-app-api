import { StatusCodes } from "http-status-codes"
import { CustomAPIError } from "./custom-error"

export class UnauthenticatedAPIError extends CustomAPIError {
	constructor(message: string) {
		super(message, StatusCodes.UNAUTHORIZED)
	}
}
