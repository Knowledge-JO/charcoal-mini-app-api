import { model, Schema } from "mongoose"

export type PotionType = "mountain" | "sea" | "forest" | "aerial"

export interface IPotion {
	type: PotionType
	requirement: {
		userLevel?: number
		userPotionPwr?: {
			type: PotionType
			pwr: number
		}
	}
	image: string
	overallPower: number
	title: string
	stars: number
	startingPrice: number
}

const potionSettingsSchema = new Schema(
	{
		type: { type: String, required: [true, "Potion type is required"] },
		requirement: { type: Object, required: false, default: {} },
		image: { type: String, required: [true, "Potion image is required"] },
		overallPower: {
			type: Number,
			required: [true, "Potion power is required"],
		},
		title: { type: String, required: [true, "Potion title is required"] },
		stars: { type: Number, required: false, default: 0 },
		startingPrice: {
			type: Number,
			required: [true, "price for potion is required"],
		},
	},
	{ timestamps: true }
)

const PotionSetting = model<IPotion>("PotionSetting", potionSettingsSchema)

export default PotionSetting
