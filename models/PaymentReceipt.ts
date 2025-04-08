import { model, Schema } from "mongoose"

type Item = {
	itemQuantity: number
	item: string
}

type PaymentReceiptType = {
	userId: number
	invoiceId: string
	transactionId: string
	amount: string
	item: Item
}

const paymentReceiptSchema = new Schema<PaymentReceiptType>({
	userId: { type: Number, required: [true, "user id is required"] },
	invoiceId: { type: String, required: [true, "invoice id is required"] },
	transactionId: {
		type: String,
		required: [true, "transaction id is required"],
	},
	amount: {
		type: String,
		required: [true, "payment amount is required"],
	},
	item: {
		type: Object,
		required: [true, "item bought is required"],
	},
})

const PaymentReceipt = model<PaymentReceiptType>(
	"PaymentReceipt",
	paymentReceiptSchema
)

export default PaymentReceipt
