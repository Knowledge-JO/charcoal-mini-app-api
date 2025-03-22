import { Request, Response } from "express"
import User from "../models/user"
import SlotMachine, {
	SlotItemDataType,
	SlotMachineItems,
} from "../models/slotMachine"
import { StatusCodes } from "http-status-codes"
import { BadRequestAPIError } from "../errors"

async function playSlotMachine(req: Request, res: Response) {
	const { id } = req.params
	const body = req.body
	const bet = Number(body.embers) || 1
	const user = (await User.findOne({ telegramId: id }))!

	const sm = (await SlotMachine.find({}))[0]
	const items = sm.slotMachine

	if (user.embers < bet) {
		throw new BadRequestAPIError("Insufficient embers to use slot machine")
	}

	const { name, occurrence } = (await slotMachine(items))!

	await user.updateOne({
		embers: user.embers - bet, // deduct embers for using slot machine
	})

	const wonItemIndex = items.findIndex((item, index) => item.name == name)
	const wonItem = items[wonItemIndex]
	const reward = occurrence == 2 ? wonItem["reward-2"] : wonItem["reward-3"]
	switch (name) {
		case "coins":
			await user.updateOne({
				CPoints: user.CPoints + reward * bet,
			})
			break
		case "charcoal":
			await user.updateOne({
				charcoals: user.charcoals + reward * bet,
			})
			break
		case "embers":
			await user.updateOne({
				embers: user.embers + reward * bet,
			})
			break
		case "portion-aerial":
			await user.updateOne({
				"potions.aerial": user.potions.aerial + reward * bet,
			})
			break
		case "potion-forest":
			await user.updateOne({
				"potions.forest": user.potions.forest + reward * bet,
			})
			break
		case "potion-mountain":
			await user.updateOne({
				"potions.mountain": user.potions.mountain + reward * bet,
			})
			break
		case "potion-sea":
			await user.updateOne({
				"potions.sea": user.potions.sea + reward * bet,
			})
	}

	res
		.status(StatusCodes.OK)
		.json({ status: "OK", won: { wonItemIndex, occurrence } })
}

type CumulativeProbType = {
	name: SlotMachineItems
	cumulativeSum: number
	occurrence: number
}

async function slotMachine(items: SlotItemDataType[]) {
	const randValue = Math.random()

	const totalProb = items.reduce(
		(acc, item) => acc + (item["probability-2"] + item["probability-3"]),
		0
	)

	const cumulativeProbs: CumulativeProbType[] = []
	let cumulativeSum = 0

	for (const item of items) {
		cumulativeSum += item["probability-2"] / totalProb
		cumulativeProbs.push({
			name: item.name,
			cumulativeSum,
			occurrence: 2,
		})
		cumulativeSum += item["probability-3"] / totalProb
		cumulativeProbs.push({
			name: item.name,
			cumulativeSum,
			occurrence: 3,
		})
	}

	for (const { name, cumulativeSum, occurrence } of cumulativeProbs) {
		if (randValue < cumulativeSum) return { name, occurrence }
	}
}

export { playSlotMachine }
