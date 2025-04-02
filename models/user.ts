import { model, Schema, Types } from "mongoose"
import { timeInSec } from "../utils/helper"
import {
	DayType,
	defaultDailyRewards,
	rewardsDefault,
	RewardType,
} from "./globalSetting"
import { PotionType } from "./PotionSetting"

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
	charcoalTurbo: number
	charcoalTurboEndTime: number
	charcoalTurboLimit: number
	charcoalTurboFloatingLimit: number
	charcoalTurboLastUpdate: number
	charcoalTurboLastRefill: number
	rechargeFactor: number
	lastTapTimeInSecs: number
	lastRefill: number
}
const defaultTap: TapType = {
	energy: 1000,
	floatingEnergy: 1000,
	tapPower: 1,
	charcoalTurbo: 2,
	charcoalTurboEndTime: 0,
	charcoalTurboLimit: 3,
	charcoalTurboFloatingLimit: 3,
	charcoalTurboLastUpdate: 0,
	charcoalTurboLastRefill: 0,
	rechargeFactor: 1,
	lastTapTimeInSecs: 0,
	lastRefill: 0,
}

export type UpgradeItems =
	| "multiTap"
	| "energyLimits"
	| "charcoalTurbo"
	| "emberBurst"
	| "energyRechargeFactor"

type UpgradeType = {
	[key in UpgradeItems]: {
		level: number
	}
}

const defaultUpgrades: UpgradeType = {
	multiTap: {
		level: 1,
	},
	energyLimits: {
		level: 1,
	},
	charcoalTurbo: {
		level: 1,
	},
	emberBurst: {
		level: 1,
	},
	energyRechargeFactor: {
		level: 1,
	},
}

type PotionDataType = {
	[key in PotionType]: number
}

export type OwnedPotionType = {
	id: Types.ObjectId
	power: number
	price: number
	coolDownPeriodSecs: number
	coolDownPeriodTime: number
}

const defaultPotionData: PotionDataType = {
	aerial: 0,
	mountain: 0,
	sea: 0,
	forest: 0,
}

export interface IUser {
	telegramId: number
	name: string
	dailyReward: DailyDataType
	referrals: Array<ReferralType>
	referralCode: string
	referredBy: string
	CPoints: number
	charcoals: number
	embers: number
	emberBurst: number
	tapMining: TapType
	upgrades: UpgradeType
	potions: PotionDataType
	completedTasks: Array<string>
	ownedPotionCards: Array<OwnedPotionType>
}

const userSchema = new Schema(
	{
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
		emberBurst: {
			type: Number,
			required: false,
			default: 1000,
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
		upgrades: {
			type: Object,
			required: false,
			default: defaultUpgrades,
		},
		potions: {
			type: Object,
			required: false,
			default: defaultPotionData,
		},
		completedTasks: {
			type: Array,
			required: false,
			default: [],
		},
		ownedPotionCards: {
			type: Array,
			required: false,
			default: [],
		},
	},
	{ timestamps: true }
)

userSchema.pre("save", async function () {
	this.tapMining.lastTapTimeInSecs = timeInSec()
})

const User = model<IUser>("User", userSchema)

export default User
