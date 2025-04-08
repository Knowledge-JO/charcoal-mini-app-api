import { Request, Response } from "express"
import User, { OwnedPotionType } from "../models/user"
import GlobalSettings, { UserLevelSettings } from "../models/globalSetting"
import PotionSetting from "../models/PotionSetting"
import { BadRequestAPIError, NotFoundAPIError } from "../errors"
import { timeInSec } from "../utils/helper"
import { StatusCodes } from "http-status-codes"

async function getPotionCards(req: Request, res: Response) {
	const potionSetting = await PotionSetting.find({})

	res.status(StatusCodes.OK).json({ data: potionSetting })
}

async function getUserLevel(req: Request, res: Response) {
	const { id } = req.params
	const user = (await User.findOne({ telegramId: id }))!
	const globalSettings = (await GlobalSettings.find({}))![0]
	const userLevelSettings = globalSettings.userLevelSettings

	const userPoints = user.CPoints

	const userLevel = await _getUserLevel(userLevelSettings, userPoints)

	res.status(StatusCodes.OK).json({ userLevel })
}

async function buyAndUpgradePotionCard(req: Request, res: Response) {
	const { id, cardId } = req.params

	const user = (await User.findOne({ telegramId: id }))!
	const globalSettings = (await GlobalSettings.find({}))![0]
	const potionSetting = await PotionSetting.find({})

	const selectedPotionCard = potionSetting.find(
		(card) => card._id.toString() == cardId
	)

	if (!selectedPotionCard)
		throw new NotFoundAPIError("Selected potion card does not exists")

	const userOwnedPotionCards = user.ownedPotionCards

	const upgradePotionCardIndex = userOwnedPotionCards.findIndex(
		(card) => card.id.toString() == cardId
	)
	const priceIncreaseRate = globalSettings.potionPriceIncreaseRateSetting
	const userPoints = user.CPoints

	// get user level
	const userLevelSettings = globalSettings.userLevelSettings
	const userLevel = await _getUserLevel(userLevelSettings, userPoints)

	if (upgradePotionCardIndex >= 0) {
		// upgrade
		const upgradePotionCard = userOwnedPotionCards[upgradePotionCardIndex]

		if (upgradePotionCard.power == selectedPotionCard.overallPower) {
			throw new BadRequestAPIError("Upgrade limit reached")
		}

		if (userPoints < upgradePotionCard.price)
			throw new BadRequestAPIError("Insufficient points to upgrade potion card")

		if (upgradePotionCard.coolDownPeriodTime > timeInSec())
			throw new BadRequestAPIError("Cool down period not over")

		const coolDownPeriodSecs =
			upgradePotionCard.coolDownPeriodSecs *
				globalSettings.potionCoolDownIncreaseRateSetting +
			upgradePotionCard.coolDownPeriodSecs

		const newUpgradedPotionCard: OwnedPotionType = {
			...upgradePotionCard,
			price:
				upgradePotionCard.price * priceIncreaseRate + upgradePotionCard.price,
			power: upgradePotionCard.power + 1,
			coolDownPeriodSecs,
			coolDownPeriodTime: timeInSec() + coolDownPeriodSecs,
		}
		const removeIndex = userOwnedPotionCards.filter(
			(card) => card.id != upgradePotionCard.id
		)
		const newUserOwnedPotion = [...removeIndex, newUpgradedPotionCard]
		await user.updateOne({
			ownedPotionCards: newUserOwnedPotion,
			CPoints: userPoints - upgradePotionCard.price,
		})
	} else {
		// buy
		const selectedPCLvlReq = selectedPotionCard.requirement.userLevel
		if (selectedPCLvlReq) {
			if (selectedPCLvlReq > userLevel.level) {
				throw new BadRequestAPIError(
					`Level ${selectedPCLvlReq} required to unlock this potion card`
				)
			}
		}

		if (userPoints < selectedPotionCard.startingPrice)
			throw new BadRequestAPIError(
				"Insufficient points to purchase potion card"
			)

		const newUserOwnedPotion: OwnedPotionType[] = [
			...userOwnedPotionCards,
			{
				id: selectedPotionCard._id,
				power: 1,
				coolDownPeriodSecs: globalSettings.potionCoolDownSetting,
				coolDownPeriodTime: 0,
				price:
					selectedPotionCard.startingPrice * priceIncreaseRate +
					selectedPotionCard.startingPrice,
			},
		]
		await user.updateOne({
			ownedPotionCards: newUserOwnedPotion,
			CPoints: userPoints - selectedPotionCard.startingPrice,
		})
	}

	res.status(StatusCodes.OK).json({ message: "OK" })
}

async function _getUserLevel(
	userLevelSettings: UserLevelSettings[],
	userPoints: number
) {
	const userLevelPoints = userLevelSettings.map((lvl) => lvl.pointsRq)

	let userLevelIndex: number

	if (userPoints >= Number(userLevelPoints.at(-1))) {
		userLevelIndex = userLevelPoints.length - 1
	} else {
		userLevelIndex = userLevelPoints.findIndex((point) => userPoints < point)
		//userLevelIndex = userLevelIndex - 1
	}

	const userLevel = userLevelSettings[userLevelIndex < 0 ? 0 : userLevelIndex]

	return userLevel
}

export { getPotionCards, buyAndUpgradePotionCard, getUserLevel }
