import { Request, Response } from "express"
import User from "../models/user"
import { timeInSec } from "../utils/helper"
import { StatusCodes } from "http-status-codes"
import GlobalSettings, { DayType, RewardType } from "../models/globalSettings"

async function dailyReward(req: Request, res: Response) {
	// update daily reward
	// day 1 - day7
	// 1 day missed, back to day 1
	// day7 claimed - back to day 1
	const { id } = req.params

	// reset
	await reset(+id)

	const user = (await User.findOne({ telegramId: id }))!
	const days: DayType[] = [
		"day1",
		"day2",
		"day3",
		"day4",
		"day5",
		"day6",
		"day7",
	]

	const currentDay = user.dailyReward.currentDay
	const index = days.indexOf(currentDay)
	const nextStartTime = user.dailyReward.nextStartTime

	const globalSettings = (await GlobalSettings.find({}))[0]

	if (timeInSec() >= nextStartTime) {
		const nextDay = days[index < days.length - 1 ? index + 1 : 0]
		const totalEarned: RewardType = {
			coins:
				user.dailyReward.totalRewardsEarned.coins +
				globalSettings.dailyRewards[currentDay].coins,
			charcoals:
				user.dailyReward.totalRewardsEarned.charcoals +
				globalSettings.dailyRewards[currentDay].charcoals,
			ember:
				user.dailyReward.totalRewardsEarned.ember +
				globalSettings.dailyRewards[currentDay].ember,
		}

		await user.updateOne({
			CPoints: user.CPoints + globalSettings.dailyRewards[currentDay].coins,
			charcoals:
				user.charcoals + globalSettings.dailyRewards[currentDay].charcoals,
			firePoints:
				user.charcoals + globalSettings.dailyRewards[currentDay].ember,
			"dailyReward.totalRewardsEarned": totalEarned,
			"dailyReward.currentDay": nextDay,
			"dailyReward.startTime": timeInSec(),
			"dailyReward.nextStartTime": timeInSec(24),
			"dailyReward.resetTime": timeInSec(48),
		})

		res.status(StatusCodes.OK).json({
			currentDay: nextDay,
			totalRewardsEarned: totalEarned,
			message: "daily reward claimed",
		})
		return
	}
	res.status(StatusCodes.OK).json({
		currentDay,
		totalRewardsEarned: user.dailyReward.totalRewardsEarned,
	})
}
async function reset(id: number): Promise<boolean> {
	// reset
	const user = (await User.findOne({ telegramId: id }))!
	const resetTime = user.dailyReward.resetTime
	if (timeInSec() > resetTime) {
		await User.updateOne(
			{ telegramId: id },
			{
				"dailyReward.currentDay": "day1",
				"dailyReward.startTime": timeInSec(),
				"dailyReward.nextStartTime": timeInSec(24), // next 24hrs
				"dailyReward.resetTime": timeInSec(48), // next 48hrs
			}
		)
		return true
	}
	return false
}

export { dailyReward }
