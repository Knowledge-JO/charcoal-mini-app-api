type UpgradeSettingsType = {
	settings: {
		price: number
		upgrade: number
	}[]
	NoLevels: number
}

const defaultEnergyLimitsSettings: UpgradeSettingsType = {
	settings: [
		{ price: 0, upgrade: 1000 },
		{ price: 2000, upgrade: 1500 },
		{ price: 10000, upgrade: 3000 },
		{ price: 25000, upgrade: 4500 },
		{ price: 50000, upgrade: 6000 },
		{ price: 100000, upgrade: 7500 },
		{ price: 200000, upgrade: 9000 },
		{ price: 400000, upgrade: 10500 },
		{ price: 800000, upgrade: 12000 },
		{ price: 1600000, upgrade: 13500 },
		{ price: 3000000, upgrade: 15000 },
	],
	NoLevels: 11,
}

const defaultMultiTapSettings: UpgradeSettingsType = {
	settings: [
		{ price: 0, upgrade: 1 },
		{ price: 2000, upgrade: 2 },
		{ price: 10000, upgrade: 3 },
		{ price: 15000, upgrade: 4 },
		{ price: 20000, upgrade: 5 },
		{ price: 50000, upgrade: 6 },
		{ price: 100000, upgrade: 7 },
		{ price: 250000, upgrade: 8 },
		{ price: 500000, upgrade: 9 },
		{ price: 1000000, upgrade: 10 },
		{ price: 2000000, upgrade: 11 },
		{ price: 5000000, upgrade: 12 },
		{ price: 10000000, upgrade: 13 },
		{ price: 15000000, upgrade: 14 },
		{ price: 25000000, upgrade: 15 },
		{ price: 40000000, upgrade: 16 },
		{ price: 50000000, upgrade: 17 },
		{ price: 75000000, upgrade: 18 },
		{ price: 100000000, upgrade: 19 },
		{ price: 500000000, upgrade: 20 },
	],
	NoLevels: 20,
}

const defaultEmberBurstSettings: UpgradeSettingsType = {
	settings: [
		{ price: 0, upgrade: 1000 },
		{ price: 2000, upgrade: 1500 },
		{ price: 10000, upgrade: 2000 },
		{ price: 25000, upgrade: 2500 },
		{ price: 50000, upgrade: 3000 },
		{ price: 100000, upgrade: 3500 },
		{ price: 200000, upgrade: 4000 },
		{ price: 300000, upgrade: 4500 },
		{ price: 400000, upgrade: 5000 },
		{ price: 500000, upgrade: 5500 },
		{ price: 600000, upgrade: 6000 },
		{ price: 700000, upgrade: 6500 },
		{ price: 800000, upgrade: 7000 },
		{ price: 900000, upgrade: 7500 },
		{ price: 1000000, upgrade: 8000 },
		{ price: 1500000, upgrade: 8500 },
		{ price: 3000000, upgrade: 9000 },
		{ price: 5000000, upgrade: 9500 },
		{ price: 7500000, upgrade: 10000 },
	],
	NoLevels: 19,
}

const defaultCharcoalTurboSettings: UpgradeSettingsType = {
	settings: [
		{ price: 0, upgrade: 2 },
		{ price: 2000, upgrade: 3 },
		{ price: 10000, upgrade: 4 },
		{ price: 15000, upgrade: 5 },
		{ price: 20000, upgrade: 6 },
		{ price: 50000, upgrade: 7 },
		{ price: 100000, upgrade: 8 },
		{ price: 250000, upgrade: 9 },
		{ price: 500000, upgrade: 10 },
		{ price: 1000000, upgrade: 11 },
		{ price: 2000000, upgrade: 12 },
		{ price: 5000000, upgrade: 13 },
		{ price: 10000000, upgrade: 14 },
		{ price: 15000000, upgrade: 15 },
	],
	NoLevels: 14,
}

type EnergyRechargeFactorSettingsType = UpgradeSettingsType & {
	defaults: {
		factor: number
		factorInSecs: number
	}
}
const defaultEnergyRechargeFactorSettings: EnergyRechargeFactorSettingsType = {
	settings: [
		{ price: 0, upgrade: 1 },
		{ price: 2000, upgrade: 0.9 },
		{ price: 10000, upgrade: 0.8 },
		{ price: 25000, upgrade: 0.7 },
		{ price: 50000, upgrade: 0.6 },
		{ price: 75000, upgrade: 0.5 },
	],
	defaults: {
		factor: 1,
		factorInSecs: 60 * 60 * 2, // 2hrs
	},
	NoLevels: 6,
}

export type { UpgradeSettingsType, EnergyRechargeFactorSettingsType }
export {
	defaultCharcoalTurboSettings,
	defaultEmberBurstSettings,
	defaultEnergyLimitsSettings,
	defaultEnergyRechargeFactorSettings,
	defaultMultiTapSettings,
}
