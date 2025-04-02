import { Request, Response } from "express"
import GlobalSettings from "../models/globalSetting"
import { StatusCodes } from "http-status-codes"

async function globalSettings(req: Request, res: Response) {
	const settings = (await GlobalSettings.find({}))![0]
	res.status(StatusCodes.OK).json({ data: settings })
}

export { globalSettings }
