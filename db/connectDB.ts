import mongoose from "mongoose"

export async function connect(mongoURI: string) {
	await mongoose.connect(mongoURI)
}
