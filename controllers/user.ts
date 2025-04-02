import { Request, Response } from "express"
import User, { ReferralType } from "../models/user"
import { createJWT } from "../utils/helper"
import { StatusCodes } from "http-status-codes"
import ShortUniqueId from "short-unique-id"
import { BadRequestAPIError, NotFoundAPIError } from "../errors"
import GlobalSettings from "../models/globalSetting"

async function createUser(req: Request, res: Response) {
	const { telegramId, name, referredBy } = req.body

	if (!telegramId) throw new BadRequestAPIError("Invalid credentials")

	const userAccount = await User.findOne({ telegramId })

	const token = createJWT(telegramId, name)

	if (userAccount) {
		// throw new BadRequestAPIError("User already exists")
		res.status(StatusCodes.CREATED).json({ data: userAccount, token })
		return
	}

	const uid = new ShortUniqueId({ length: 10 })
	const referralCode = uid.rnd()

	const user = new User({
		...req.body,
		referredBy: "",
		referralCode,
	})

	// check if referral account exist and update
	const refAccount = await User.findOne({ referralCode: referredBy })
	const globalSettings = (await GlobalSettings.find({}))![0]
	if (refAccount) {
		user.CPoints += globalSettings.referralBonusSettings
		user.referredBy = referredBy
		const refs = refAccount.referrals

		const referredUserDets: ReferralType = {
			name: req.body.name,
			referralCode,
		}

		await refAccount.updateOne({
			referrals: [...refs, referredUserDets],
			CPoints: refAccount.CPoints + globalSettings.referralBonusSettings,
		})
	}

	await user.save()

	res.status(StatusCodes.CREATED).json({ data: user, token })
}

async function loginUser(req: Request, res: Response) {
	const { telegramId } = req.body
	const user = await User.findOne({ telegramId })
	if (!user) throw new NotFoundAPIError("User not found")
	const token = createJWT(telegramId, user.name)
	res.status(StatusCodes.OK).json({ data: user, token })
}

async function getUsers(req: Request, res: Response) {
	const users = await User.find({}).select("name CPoints -_id").sort("-CPoints")
	res.status(StatusCodes.OK).json({ data: users, nbHits: users.length })
}

async function getUser(req: Request, res: Response) {
	const params = req.params
	const user = await User.findOne({ telegramId: params.id })
	res.status(StatusCodes.OK).json({ data: user })
}

// daily rewards
// leader board - get all users
// buy cards - cards have mining rate.

export { createUser, loginUser, getUsers, getUser }
