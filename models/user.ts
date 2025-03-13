import { model, Schema } from "mongoose"
import { timeInSec } from "../utils/helper"
import { DayType, rewardsDefault, RewardType } from "./globalSettings"

type DailyDataType = {
	currentDay: DayType
	currentDayReward: number
	totalRewardsEarned: RewardType
	startTime: number
	nextStartTime: number
	resetTime: number
	streak: number
}

const dailyRewardDefaultData: DailyDataType = {
	currentDay: "day1",
	currentDayReward: 100,
	totalRewardsEarned: rewardsDefault,
	startTime: timeInSec(),
	nextStartTime: timeInSec(),
	resetTime: timeInSec(24),
	streak: 0,
}

export type ReferralType = {
	name: string
	referralCode: string
}

interface IUser {
	telegramId: number
	name: string
	dailyReward: DailyDataType
	referrals: Array<ReferralType>
	referralCode: string
	referredBy: string
	CPoints: number
	charcoals: number
	firePoints: number
}

const userSchema = new Schema({
	telegramId: {
		type: Number,
		required: [true, "telegram user ID is required"],
	},
	name: {
		type: String,
		required: [true, "Name is required"],
		minLength: 1,
		maxLength: 60,
	},
	dailyReward: {
		type: Object,
		required: false,
		default: dailyRewardDefaultData,
	},

	CPoints: {
		type: Number,
		required: false,
		default: 1000,
	},
	charcoals: {
		type: Number,
		required: false,
		default: 100,
	},
	firePoints: {
		type: Number,
		required: false,
		default: 100,
	},

	referralCode: {
		type: String,
		required: [true, "referral code for user is required"],
	},

	referrals: {
		type: Array<ReferralType>,
		required: false,
		default: [],
	},

	referredBy: {
		type: String,
		required: false,
		default: "",
	},
})

const User = model<IUser>("User", userSchema)

export default User
