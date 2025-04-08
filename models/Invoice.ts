import { model, Schema } from "mongoose"

export type StatusType = "success" | "pending" | "failed" | "canceled"

type InvoiceType = {
	title: string
	description: string
	userId: number
	amount: number
	requestId: string
	status: StatusType
	itemQuantity: number
	item: string
}

const invoiceSchema = new Schema<InvoiceType>(
	{
		title: { type: String, required: [true, "title is required"] },
		description: {
			type: String,
			required: [true, "payment description is required"],
		},
		userId: { type: Number, required: [true, "UserId is required"] },
		amount: { type: Number, required: [true, "payment amount is required"] },
		requestId: {
			type: String,
			required: [true, "Payment request Id is required"],
		},
		status: {
			type: String,
			enum: ["success", "pending", "failed", "canceled"],
			required: [true, "payment status is required"],
		},
		itemQuantity: {
			type: Number,
			required: [true, "quantity of item purchase is required"],
		},
		item: {
			type: String,
			required: [true, "item name is required"],
		},
	},
	{ timestamps: true }
)

const Invoice = model<InvoiceType>("Invoice", invoiceSchema)
export default Invoice
