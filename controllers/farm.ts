import { Request, Response } from "express"
import User from "../models/user"
import { timeInSec } from "../utils/helper"
import { StatusCodes } from "http-status-codes"
import GlobalSettings, { DayType, RewardType } from "../models/globalSettings"
import { BadRequestAPIError } from "../errors"

async function claimDailyReward(req: Request, res: Response) {
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
			embers:
				user.dailyReward.totalRewardsEarned.embers +
				globalSettings.dailyRewards[currentDay].embers,
		}

		const currentDayReward: RewardType = {
			coins: globalSettings.dailyRewards[nextDay].coins,
			charcoals: globalSettings.dailyRewards[nextDay].charcoals,
			embers: globalSettings.dailyRewards[nextDay].embers,
		}

		await user.updateOne({
			CPoints: user.CPoints + globalSettings.dailyRewards[currentDay].coins,
			charcoals:
				user.charcoals + globalSettings.dailyRewards[currentDay].charcoals,
			embers: user.embers + globalSettings.dailyRewards[currentDay].embers,
			"dailyReward.totalRewardsEarned": totalEarned,
			"dailyReward.currentDayReward": currentDayReward,
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

async function getDailyRewardData(req: Request, res: Response) {
	const { id } = req.params

	// reset
	await reset(+id)

	const user = (await User.findOne({ telegramId: id }))!
	const currentDay = user.dailyReward.currentDay

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

async function multiTap(req: Request, res: Response) {
	const params = req.params
	const user = (await User.findOne({ telegramId: params.id }))!

	const tapPower = user.tapMining.tapPower
	if (!(user.tapMining.floatingEnergy > tapPower)) {
		throw new BadRequestAPIError("Energy exhausted")
	}
	await user.updateOne({
		CPoints: user.CPoints + tapPower,
		"tapMining.floatingEnergy": user.tapMining.floatingEnergy - tapPower,
		"tapMining.lastTapTimeInSecs": timeInSec(),
		"tapMining.lastRefill": 0,
	})

	res.status(StatusCodes.OK).json({ status: "OK" })
}
async function rechargeEnergy(req: Request, res: Response) {
	const params = req.params
	const user = (await User.findOne({ telegramId: params.id }))!
	const globalSettings = (await GlobalSettings.find({}))[0]
	const energyRechargeDefaults =
		globalSettings.energyRechargeFactorSettings.defaults

	const userEnergyFactor = user.tapMining.rechargeFactor

	const userLastTapTime = user.tapMining.lastTapTimeInSecs

	const energyRechargeTime =
		(energyRechargeDefaults.factorInSecs * userEnergyFactor) /
		energyRechargeDefaults.factor

	const energyPerSec = user.tapMining.energy / energyRechargeTime

	const energyRecovered = (timeInSec() - userLastTapTime) * energyPerSec

	const floatingEnergy = user.tapMining.floatingEnergy

	const energy = user.tapMining.energy

	const lastRefill = user.tapMining.lastRefill

	const nextRefill = energyRecovered - lastRefill

	if (floatingEnergy < energy) {
		if (floatingEnergy + energyRecovered > energy) {
			await user.updateOne({
				"tapMining.floatingEnergy": energy,
				"tapMining.lastRefill": 0,
			})
		} else {
			await user.updateOne({
				"tapMining.floatingEnergy": floatingEnergy + nextRefill,
				"tapMining.lastRefill": energyRecovered,
			})
		}
	}

	res.status(StatusCodes.OK).json({ status: "OK" })
	// .json({ energyRecovered, timeLapsed: timeInSec() - userLastTapTime })
}
export { claimDailyReward, getDailyRewardData, multiTap, rechargeEnergy }
