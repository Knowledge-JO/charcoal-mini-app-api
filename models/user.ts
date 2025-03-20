import { model, Schema } from "mongoose"
import { timeInSec } from "../utils/helper"
import {
	DayType,
	defaultDailyRewards,
	rewardsDefault,
	RewardType,
} from "./globalSettings"

type DailyDataType = {
	currentDay: DayType
	currentDayReward: RewardType
	totalRewardsEarned: RewardType
	startTime: number
	nextStartTime: number
	resetTime: number
	streak: number
}

const dailyRewardDefaultData: DailyDataType = {
	currentDay: "day1",
	currentDayReward: {
		...rewardsDefault,
		coins: defaultDailyRewards.day1.coins,
	},
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
type TapType = {
	energy: number
	floatingEnergy: number
	tapPower: number
	rechargeFactor: number
	lastTapTimeInSecs: number
	lastRefill: number
}
const defaultTap: TapType = {
	energy: 1000,
	floatingEnergy: 1000,
	tapPower: 1,
	rechargeFactor: 1,
	lastTapTimeInSecs: 0,
	lastRefill: 0,
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
	embers: number
	tapMining: TapType
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
		default: 50000,
	},
	charcoals: {
		type: Number,
		required: false,
		default: 10,
	},
	embers: {
		type: Number,
		required: false,
		default: 50,
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

	tapMining: {
		type: Object,
		required: false,
		default: defaultTap,
	},
})

userSchema.pre("save", async function () {
	this.tapMining.lastTapTimeInSecs = timeInSec()
})

const User = model<IUser>("User", userSchema)

export default User
