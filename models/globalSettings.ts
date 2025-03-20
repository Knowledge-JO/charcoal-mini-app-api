import { model, Schema } from "mongoose"
import {
	EnergyRechargeFactorSettingsType,
	UpgradeSettingsType,
	defaultEnergyLimitsSettings,
	defaultCharcoalTurboSettings,
	defaultEmberBurstSettings,
	defaultMultiTapSettings,
	defaultEnergyRechargeFactorSettings,
} from "./upgrades"

export type DayType =
	| "day1"
	| "day2"
	| "day3"
	| "day4"
	| "day5"
	| "day6"
	| "day7"

export type RewardType = {
	coins: number
	charcoals: number
	embers: number
}
export type DailyRewardType = {
	[key in DayType]: RewardType
}

export const rewardsDefault: RewardType = {
	coins: 0,
	charcoals: 0,
	embers: 0,
}

export const defaultDailyRewards: DailyRewardType = {
	day1: {
		...rewardsDefault,
		coins: 1000,
	},
	day2: {
		...rewardsDefault,
		coins: 5000,
	},

	day3: {
		...rewardsDefault,
		coins: 10000,
	},

	day4: {
		...rewardsDefault,
		coins: 15000,
	},

	day5: {
		...rewardsDefault,
		coins: 50000,
	},
	day6: {
		...rewardsDefault,
		coins: 100000,
	},
	day7: {
		coins: 500000,
		charcoals: 10,
		embers: 5,
	},
}

type SettingType = {
	dailyRewards: DailyRewardType
	energyLimitsSettings: UpgradeSettingsType
	multiTapSettings: UpgradeSettingsType
	emberBurstSettings: UpgradeSettingsType
	charcoalTurboSettings: UpgradeSettingsType
	energyRechargeFactorSettings: EnergyRechargeFactorSettingsType
}

const globalSettingsSchema = new Schema({
	dailyRewards: {
		type: Object,
		required: false,
		default: defaultDailyRewards,
	},
	energyLimitsSettings: {
		type: Object,
		required: false,
		default: defaultEnergyLimitsSettings,
	},
	multiTapSettings: {
		type: Object,
		required: false,
		default: defaultMultiTapSettings,
	},
	emberBurstSettings: {
		type: Object,
		required: false,
		default: defaultEmberBurstSettings,
	},
	charcoalTurboSettings: {
		type: Object,
		required: false,
		default: defaultCharcoalTurboSettings,
	},
	energyRechargeFactorSettings: {
		type: Object,
		required: false,
		default: defaultEnergyRechargeFactorSettings,
	},
})

const GlobalSettings = model<SettingType>("GlobalSetting", globalSettingsSchema)

export default GlobalSettings
