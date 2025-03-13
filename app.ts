import "express-async-errors"
import express from "express"
import dotenv from "dotenv"
import userRoute from "./routes/user"
import farmRoute from "./routes/farm"
import { connect } from "./db/connectDB"
import { errorHandlerMiddleware, notFoundMiddleware } from "./middlewares"
import GlobalSettings from "./models/globalSettings"

dotenv.config()

const port = process.env.PORT || 3000

const app = express()

app.use(express.json())

const baseEndpoint = "/api/v1"
app.use(baseEndpoint, userRoute)
app.use(`${baseEndpoint}/farm`, farmRoute)

app.use(notFoundMiddleware)

app.use(errorHandlerMiddleware)

async function init() {
	const uri = process.env.MONGO_URI
	if (!uri) throw new Error("Invalid URI")
	try {
		await connect(uri)
		console.log("Database connection successfull...")
		const globalSettings = await GlobalSettings.find({})
		if (globalSettings.length == 0) {
			await GlobalSettings.create({})
		}
		app.listen(port, (err) => {
			if (err) {
				return console.log("error starting server", err)
			}
			console.log("Server is online on port: ", port)
		})
	} catch (err) {
		console.log("Error connecting to DB", err)
	}
}

init()
