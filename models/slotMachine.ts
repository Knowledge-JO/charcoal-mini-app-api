import { model, Schema } from "mongoose"

export type SlotMachineItems =
	| "coins"
	| "embers"
	| "charcoal"
	| "potion-aerial"
	| "potion-forest"
	| "potion-mountain"
	| "potion-sea"
	| "nothing"

export type SlotItemDataType = {
	name: SlotMachineItems
	"probability-2": number
	"probability-3": number
	"reward-2": number
	"reward-3": number
}

const defaultData: SlotItemDataType[] = [
	{
		"reward-2": 10000,
		"reward-3": 50000,
		"probability-2": 25,
		"probability-3": 15,
		name: "coins",
	},

	{
		"reward-2": 5,
		"reward-3": 20,
		"probability-2": 8,
		"probability-3": 5,
		name: "embers",
	},

	{
		"reward-2": 5,
		"reward-3": 20,
		"probability-2": 15,
		"probability-3": 10,
		name: "charcoal",
	},
	{
		"reward-2": 1,
		"reward-3": 3,
		"probability-2": 3,
		"probability-3": 1,
		name: "potion-aerial",
	},

	{
		"reward-2": 1,
		"reward-3": 3,
		"probability-2": 3,
		"probability-3": 1,
		name: "potion-forest",
	},

	{
		"reward-2": 1,
		"reward-3": 3,
		"probability-2": 3,
		"probability-3": 1,
		name: "potion-mountain",
	},

	{
		"reward-2": 1,
		"reward-3": 3,
		"probability-2": 3,
		"probability-3": 1,
		name: "potion-sea",
	},

	{
		name: "nothing",
		"probability-2": 6,
		"probability-3": 0,
		"reward-2": 0,
		"reward-3": 0,
	},
]

type slotMachineType = {
	slotMachine: SlotItemDataType[]
}

const slotMachineSchema = new Schema({
	slotMachine: {
		type: Array,
		required: false,
		default: defaultData,
	},
})

const SlotMachine = model<slotMachineType>("SlotMachine", slotMachineSchema)

export default SlotMachine
