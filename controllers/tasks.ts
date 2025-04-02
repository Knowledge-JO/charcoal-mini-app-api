import { Request, Response } from "express"
import Task from "../models/task"
import { BadRequestAPIError, NotFoundAPIError } from "../errors"
import { StatusCodes } from "http-status-codes"
import User from "../models/user"

async function createTask(req: Request, res: Response) {
	res.send("createTask")
}

async function getTasks(req: Request, res: Response) {
	const tasks = await Task.find({})
	res.status(StatusCodes.OK).json({ data: tasks, nbHits: tasks.length })
}

async function getTask(req: Request, res: Response) {
	const { taskId } = req.params

	const task = await Task.findOne({ _id: taskId })

	if (!task) throw new NotFoundAPIError(`task #${taskId} not found`)

	res.status(StatusCodes.OK).json({ data: task })
}

async function updateTask(req: Request, res: Response) {
	res.send("Update task")
}

async function completeTask(req: Request, res: Response) {
	const { id, taskId } = req.params

	const task = await Task.findOne({ _id: taskId })

	if (!task) throw new NotFoundAPIError(`task #${taskId} not found`)

	const user = (await User.findOne({ telegramId: id }))!

	const completedTasks = user.completedTasks

	if (completedTasks.includes(taskId))
		throw new BadRequestAPIError("Task already completed")

	const newCompletedTasks = [...user.completedTasks, taskId]

	await user.updateOne({
		completedTasks: newCompletedTasks,
		CPoints: user.CPoints + task.reward,
	})

	res.status(StatusCodes.OK).json({ message: "task completed", taskId })
}

export { getTasks, getTask, completeTask, createTask, updateTask }
