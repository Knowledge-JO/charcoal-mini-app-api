import { model, Schema } from "mongoose"

type TaskType = "telegram" | "twitter" | "web" | "youtube" | "others"

export interface ITask {
	title: string
	type: TaskType
	taskCategory: string
	reward: number
	url: string
	imagePath?: string
}

const taskSchema = new Schema(
	{
		title: { type: String, required: [true, "specify the title of the task"] },
		type: {
			type: String,
			enum: ["telegram", "twitter", "web", "youtube", "others"],
			required: [true, "specify a valid task type"],
		},
		reward: { type: Number, required: [true, "Specify the task reward"] },
		imagePath: { type: String, required: false },
		taskCategory: { type: String, required: true },
	},
	{ timestamps: true }
)

const Task = model<ITask>("Task", taskSchema)

export default Task
