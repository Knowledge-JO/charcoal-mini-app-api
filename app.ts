import "express-async-errors"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import userRoute from "./routes/user"
import farmRoute from "./routes/farm"
import upgradeRoute from "./routes/upgrades"
import slotMachineRoute from "./routes/slotMachine"
import globalSettingsRoute from "./routes/globalsettings"
import potionSettingsRoute from "./routes/potionSettings"
import taskRoute from "./routes/tasks"
import { connect } from "./db/connectDB"
import { errorHandlerMiddleware, notFoundMiddleware } from "./middlewares"
import GlobalSettings from "./models/globalSetting"
import SlotMachine from "./models/slotMachine"

dotenv.config()

const port = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors({ origin: "*" }))

const baseEndpoint = "/api/v1"
app.use(baseEndpoint, userRoute)
app.use(baseEndpoint, slotMachineRoute)
app.use(baseEndpoint, globalSettingsRoute)
app.use(`${baseEndpoint}/farm`, farmRoute)
app.use(`${baseEndpoint}/purchase`, upgradeRoute)
app.use(`${baseEndpoint}/tasks`, taskRoute)
app.use(`${baseEndpoint}/potionsetting`, potionSettingsRoute)
app.use(notFoundMiddleware)

app.use(errorHandlerMiddleware)

async function init() {
	const uri = process.env.MONGO_URI
	if (!uri) throw new Error("Invalid URI")
	try {
		await connect(uri)
		console.log("Database connection successful...")
		const [globalSettings, slotMachine] = await Promise.all([
			GlobalSettings.find({}),
			SlotMachine.find({}),
		])
		if (globalSettings.length == 0) {
			await GlobalSettings.create({})
		}
		if (slotMachine.length == 0) {
			await SlotMachine.create({})
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
