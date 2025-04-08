import { model, Schema } from "mongoose"
import {
	EnergyRechargeFactorSettingsType,
	UpgradeSettingsType,
	defaultEnergyLimitsSettings,
	defaultCharcoalTurboSettings,
	defaultEmberBurstSettings,
	defaultMultiTapSettings,
	defaultEnergyRechargeFactorSettings,
} from "./upgrade"

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

export type Item = "coins" | "embers" | "charcoals"

export type PurchaseType = {
	item: Item
	itemQuantity: number
	priceStars: number
	priceTon: number
}

const defaultAvailableItemsForPurchase: PurchaseType[] = [
	{
		item: "coins",
		itemQuantity: 50000,
		priceStars: 10, // 10 stars
		priceTon: 0.5,
	},
	{
		item: "embers",
		itemQuantity: 1000,
		priceStars: 150, // 10 stars
		priceTon: 0.4,
	},
	{
		item: "embers",
		itemQuantity: 2000,
		priceStars: 300, // 10 stars
		priceTon: 0.8,
	},
	{
		item: "embers",
		itemQuantity: 3000,
		priceStars: 450, // 10 stars
		priceTon: 1.2,
	},
	{
		item: "charcoals",
		itemQuantity: 2000,
		priceStars: 15,
		priceTon: 0.8,
	},
]
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

export type UserLevelSettings = {
	level: number
	pointsRq: number
}

const defaultUserLevelSettings: UserLevelSettings[] = [
	{ level: 1, pointsRq: 0 },
	{ level: 2, pointsRq: 100000 },
	{ level: 3, pointsRq: 200000 },
	{ level: 4, pointsRq: 400000 },
	{ level: 5, pointsRq: 800000 },
	{ level: 6, pointsRq: 1600000 },
	{ level: 7, pointsRq: 2200000 },
	{ level: 8, pointsRq: 4400000 },
	{ level: 9, pointsRq: 8800000 },
	{ level: 10, pointsRq: 17600000 },
	{ level: 11, pointsRq: 35200000 },
	{ level: 12, pointsRq: 70400000 },
	{ level: 13, pointsRq: 140800000 },
	{ level: 14, pointsRq: 281600000 },
	{ level: 15, pointsRq: 563200000 },
]

export type SettingType = {
	dailyRewards: DailyRewardType
	energyLimitsSettings: UpgradeSettingsType
	multiTapSettings: UpgradeSettingsType
	emberBurstSettings: UpgradeSettingsType
	charcoalTurboSettings: UpgradeSettingsType
	energyRechargeFactorSettings: EnergyRechargeFactorSettingsType
	charcoalTurboTimeoutSettings: number
	userLevelSettings: UserLevelSettings[]
	referralBonusSettings: number
	taskValidPeriod: number
	potionCoolDownSetting: number
	potionPriceIncreaseRateSetting: number
	potionCoolDownIncreaseRateSetting: number
	itemsForPurchase: PurchaseType[]
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
	charcoalTurboTimeoutSettings: {
		type: Number,
		required: false,
		default: 10,
	},
	userLevelSettings: {
		type: Array,
		required: false,
		default: defaultUserLevelSettings,
	},
	referralBonusSettings: {
		type: Number,
		required: false,
		default: 50000,
	},
	taskValidPeriod: {
		type: Number,
		required: false,
		default: 8,
	},
	potionCoolDownSetting: {
		type: Number,
		required: false,
		default: 600,
	},
	potionPriceIncreaseRateSetting: {
		type: Number,
		required: false,
		default: 0.65,
	},
	potionCoolDownIncreaseRateSetting: {
		type: Number,
		required: false,
		default: 0.65,
	},
	itemsForPurchase: {
		type: Array,
		required: false,
		default: defaultAvailableItemsForPurchase,
	},
})

const GlobalSettings = model<SettingType>("GlobalSetting", globalSettingsSchema)

export default GlobalSettings
