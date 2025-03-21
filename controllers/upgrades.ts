import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import User, { IUser, UpgradeItems } from "../models/user"
import { Document, Types } from "mongoose"
import GlobalSettings, { SettingType } from "../models/globalSettings"
import { BadRequestAPIError } from "../errors"
import { UpgradeSettingsType } from "../models/upgrades"

async function upgrade(req: Request, res: Response) {
	const { upgrade, id } = req.params

	const upgradeItem = upgrade as UpgradeItems
	const user = (await User.findOne({ telegramId: id }))!
	const globalSettings = (await GlobalSettings.find({}))[0]

	switch (upgradeItem) {
		case "multiTap":
			await upgradeMultiTap(user, user._id, globalSettings)
			break
		case "energyLimits":
			await upgradeEnergyLimits(user, user._id, globalSettings)
			break
		case "energyRechargeFactor":
			await upgradeRechargeFactor(user, user._id, globalSettings)
			break
		case "charcoalTurbo":
			await upgradeCharcoalTurbo(user, user._id, globalSettings)
			break
		case "emberBurst":
			await upgradeEmberBurst(user, user._id, globalSettings)
			break
		default:
			throw new BadRequestAPIError("unknown upgrade type")
	}

	res.status(StatusCodes.OK).json({ status: "OK" })
}

function temp(
	user: Document<unknown, {}, IUser> & IUser,
	userCurrLevel: number,
	settings: UpgradeSettingsType["settings"]
) {
	const nextLevel = userCurrLevel + 1
	const nextLevelSettings = settings[nextLevel]

	const price = nextLevelSettings.price
	const userCoinBalance = user.CPoints

	if (nextLevel == settings.length) {
		throw new BadRequestAPIError("Level limit reached.")
	}

	if (userCoinBalance < price) {
		throw new BadRequestAPIError("Insufficient balance to make purchase.")
	}

	return { userCoinBalance, price, nextLevelSettings, nextLevel }
}

async function upgradeMultiTap(
	user: Document<unknown, {}, IUser> & IUser,
	_id: Types.ObjectId,
	globalSettings: Document<unknown, {}, SettingType> & SettingType
) {
	const userCurrLevel = user.upgrades.multiTap.level - 1 // starts from index of 0 by sub 1
	const multiTapSettings = globalSettings.multiTapSettings.settings

	const { userCoinBalance, price, nextLevelSettings, nextLevel } = temp(
		user,
		userCurrLevel,
		multiTapSettings
	)

	// update user tap power and remove coins
	await user.updateOne({
		CPoints: userCoinBalance - price,
		"tapMining.tapPower": nextLevelSettings.upgrade,
		"upgrades.multiTap.level": nextLevel + 1,
	})
}
async function upgradeEnergyLimits(
	user: Document<unknown, {}, IUser> & IUser,
	_id: Types.ObjectId,
	globalSettings: Document<unknown, {}, SettingType> & SettingType
) {
	const userCurrLevel = user.upgrades.energyLimits.level - 1 // starts from index of 0 by sub 1
	const energyLimitsSettings = globalSettings.energyLimitsSettings.settings

	const { userCoinBalance, price, nextLevelSettings, nextLevel } = temp(
		user,
		userCurrLevel,
		energyLimitsSettings
	)

	// update user energy and floating energy and remove coins
	await user.updateOne({
		CPoints: userCoinBalance - price,
		"tapMining.energy": nextLevelSettings.upgrade,
		"tapMining.floatingEnergy": nextLevelSettings.upgrade,
		"upgrades.energyLimits.level": nextLevel + 1,
	})
}

async function upgradeRechargeFactor(
	user: Document<unknown, {}, IUser> & IUser,
	_id: Types.ObjectId,
	globalSettings: Document<unknown, {}, SettingType> & SettingType
) {
	const userCurrLevel = user.upgrades.energyRechargeFactor.level - 1 // starts from index of 0 by sub 1
	const energyRechargeFactorSettings =
		globalSettings.energyRechargeFactorSettings.settings

	const { userCoinBalance, price, nextLevelSettings, nextLevel } = temp(
		user,
		userCurrLevel,
		energyRechargeFactorSettings
	)

	// update user recharge factor, upgrade level and floating energy and remove coins
	await user.updateOne({
		CPoints: userCoinBalance - price,
		"tapMining.rechargeFactor": nextLevelSettings.upgrade,
		"upgrades.energyRechargeFactor.level": nextLevel + 1,
	})
}

async function upgradeCharcoalTurbo(
	user: Document<unknown, {}, IUser> & IUser,
	_id: Types.ObjectId,
	globalSettings: Document<unknown, {}, SettingType> & SettingType
) {
	const userCurrLevel = user.upgrades.charcoalTurbo.level - 1 // starts from index of 0 by sub 1
	const charcoalTurboSettings = globalSettings.charcoalTurboSettings.settings

	const { userCoinBalance, price, nextLevelSettings, nextLevel } = temp(
		user,
		userCurrLevel,
		charcoalTurboSettings
	)
	// update user charcoal turbo, upgrade level and floating energy and remove coins
	await user.updateOne({
		CPoints: userCoinBalance - price,
		"tapMining.charcoalTurbo": nextLevelSettings.upgrade,
		"upgrades.charcoalTurbo.level": nextLevel + 1,
	})
}
async function upgradeEmberBurst(
	user: Document<unknown, {}, IUser> & IUser,
	_id: Types.ObjectId,
	globalSettings: Document<unknown, {}, SettingType> & SettingType
) {
	const userCurrLevel = user.upgrades.emberBurst.level - 1 // starts from index of 0 by sub 1
	const emberBurstSettings = globalSettings.emberBurstSettings.settings

	const { userCoinBalance, price, nextLevelSettings, nextLevel } = temp(
		user,
		userCurrLevel,
		emberBurstSettings
	)

	// update user ember burst, upgrade level and remove coins
	await user.updateOne({
		CPoints: userCoinBalance - price,
		emberBurst: nextLevelSettings.upgrade,
		"upgrades.emberBurst.level": nextLevel + 1,
	})
}

export { upgrade }
