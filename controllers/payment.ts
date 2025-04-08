import { Request, Response } from "express"
import { randomUUID } from "crypto"
import Invoice, { StatusType } from "../models/Invoice"
import User from "../models/user"
import { BadRequestAPIError, NotFoundAPIError } from "../errors"
import GlobalSettings from "../models/globalSetting"
import PaymentReceipt from "../models/PaymentReceipt"
import { StatusCodes } from "http-status-codes"

async function createInvoice(req: Request, res: Response) {
	const body = req.body
	const { itemName, itemQuantity, title, description } = body
	const requestId = randomUUID()
	const status: StatusType = "pending"
	const userId = req.params.id

	const user = await User.findOne({ telegramId: userId })

	if (!user) throw new NotFoundAPIError(`User not found`)

	const BOT_TOKEN = process.env.BOT_TOKEN
	if (!BOT_TOKEN) throw new BadRequestAPIError("bot token is not defined")

	const itemsForPurchase = (await GlobalSettings.find({}))[0].itemsForPurchase

	const item = itemsForPurchase.find(
		(item) => item.item == itemName && item.itemQuantity == itemQuantity
	)

	if (!item) throw new NotFoundAPIError(`Item [${itemName}] not found`)

	const invoice = await Invoice.create({
		title,
		description,
		userId,
		item: itemName,
		itemQuantity,
		requestId,
		status,
		amount: item.priceStars,
	})

	const response = await fetch(
		`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title,
				description,
				payload: JSON.stringify({
					item: itemName,
					itemQuantity,
					invoiceId: requestId,
				}),
				provider_token: "", // Empty for Telegram Stars payments
				currency: "XTR", // Telegram Stars currency code
				prices: [{ label: title, amount: item.priceStars }],
				start_parameter: "start_parameter",
			}),
		}
	)
	const data = await response.json()
	if (!data.ok) {
		// console.error("Telegram API error:", data)
		throw new BadRequestAPIError(`Telegram API error: ${data}`)
	}

	const invoiceLink = data.result

	res.status(StatusCodes.OK).json({
		data: invoice,
		message: "invoice created successfully",
		invoiceLink,
	})
}

async function getPaymentReceipt(req: Request, res: Response) {
	const { invoiceId } = req.query

	const receipt = await PaymentReceipt.findOne({ invoiceId })
	if (!receipt) throw new NotFoundAPIError("Payment receipt not found")

	res.status(StatusCodes.OK).json({ data: receipt })
}

async function updateInvoiceStatus(req: Request, res: Response) {
	const body = req.body
	const { invoiceId, status } = body

	const invoice = await Invoice.findOne({ requestId: invoiceId })

	if (!invoice) throw new Error(`Invoice with id-[${invoiceId}] does not exist`)

	if (invoice.status !== "pending")
		throw new BadRequestAPIError("Invoice updated already")

	const statuses: StatusType[] = ["canceled", "success", "failed", "pending"]

	if (!statuses.includes(status)) throw new BadRequestAPIError("Invalid status")

	await invoice.updateOne({
		status,
	})

	res.status(StatusCodes.OK).json({ status })
}

export { createInvoice, getPaymentReceipt, updateInvoiceStatus }
