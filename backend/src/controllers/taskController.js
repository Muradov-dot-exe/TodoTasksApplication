const Task = require('../models/Task')
const Subtask = require('../models/Subtask')
const Personnel = require('../models/Personnel')
const taskSchema = require('../schema/taskSchemaValidation')
const { z } = require('zod')
const jwt = require('jsonwebtoken')
const { updateTaskStatus } = require('../utils/cron.utils')

exports.createTask = async (req, res) => {
    try {
        const validatedData = taskSchema.parse(req.body)

        const task = await Task.create(validatedData)

        if (
            validatedData.personnelIds &&
            validatedData.personnelIds.length > 0
        ) {
            const personnel = await Personnel.findAll({
                where: { id: validatedData.personnelIds },
            })

            const updatePersonnelPromises = personnel.map((person) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        await person.update({ is_available: false })
                        resolve()
                    } catch (error) {
                        console.error(error)
                        reject()
                    }
                })
            })

            await Promise.all(updatePersonnelPromises)
            await task.setPersonnel(personnel)
        }

        if (validatedData.subtasks && validatedData.subtasks.length > 0) {
            const subtasks = validatedData.subtasks

            subtasks.forEach((subtask) => {
                subtask.task_id = task.id
            })

            await Subtask.bulkCreate(subtasks)
        }

        await task.update({ current_status: 'NEW' })

        res.status(201).json(task)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors })
        }
        res.status(400).json({ error: error.message })
    }
}

exports.getAllTasks = async (req, res) => {
    try {
        const token =
            req.cookies.token || req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await Personnel.findByPk(decodedToken.id)

        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 15

        const offset = (page - 1) * pageSize

        const tasks = await Task.findAndCountAll({
            include: [
                { model: Subtask, as: 'Subtasks' },
                {
                    model: Personnel,
                    as: 'Personnel',
                    through: { attributes: [] },
                },
            ],
            limit: pageSize,
            offset: offset,
        })

        const tasksRows = tasks.rows.filter(
            (task) =>
                task.Personnel.map((person) => person.id).includes(user.id) ||
                user.role_name !== 'Employee'
        )

        const totalPages = Math.ceil(tasksRows.length / pageSize)

        res.json({
            tasks: tasksRows,
            totalPages: totalPages,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, {
            include: [
                { model: Subtask, as: 'Subtasks' },
                { model: Personnel, as: 'Personnel' },
            ],
        })

        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }

        res.json(task)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id },
            include: [
                { model: Subtask, as: 'Subtasks' },
                {
                    model: Personnel,
                    as: 'Personnel',
                    through: { attributes: [] },
                },
            ],
        })

        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }

        if (req.body.personnelIds !== undefined) {
            if (req.body.personnelIds.length === 0) {
                const currentPersonnel = await task.getPersonnel()
                await task.setPersonnel([])
                await Personnel.update(
                    { is_available: true },
                    { where: { id: currentPersonnel.map((p) => p.id) } }
                )
            } else {
                const personnel = await Personnel.findAll({
                    where: { id: req.body.personnelIds },
                })

                for (const person of personnel) {
                    const assignedTask = await Task.findOne({
                        include: [
                            {
                                model: Personnel,
                                as: 'Personnel',
                                where: { id: person.id },
                                through: { attributes: [] },
                            },
                        ],
                    })

                    if (assignedTask && assignedTask.id !== task.id) {
                        return res.status(400).json({
                            error: `Personnel with ID ${person.id} is already assigned to another task`,
                        })
                    }
                }

                const currentPersonnel = await task.getPersonnel()
                await task.setPersonnel(personnel)
                await Personnel.update(
                    { is_available: false },
                    { where: { id: req.body.personnelIds } }
                )
                const unassignedPersonnelIds = currentPersonnel
                    .filter((p) => !req.body.personnelIds.includes(p.id))
                    .map((p) => p.id)
                if (unassignedPersonnelIds.length > 0) {
                    await Personnel.update(
                        { is_available: true },
                        { where: { id: unassignedPersonnelIds } }
                    )
                }
            }
        }

        if (req.body.subtasks && req.body.subtasks.length > 0) {
            const subtasks = req.body.subtasks.map((subtask) => {
                if (subtask?.id) {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const updatedModel = await Subtask.update(subtask, {
                                where: { id: subtask.id },
                                returning: true,
                            })

                            resolve(updatedModel[1][0])
                        } catch (e) {
                            console.error(e)
                            reject(e)
                        }
                    })
                }

                subtask.task_id = task.id

                return new Promise(async (resolve, reject) => {
                    try {
                        const newSubtask = await Subtask.create(subtask, {
                            returning: true,
                        })
                        resolve(newSubtask)
                    } catch (e) {
                        console.error(e)
                        reject(e)
                    }
                })
            })

            const values = await Promise.all(subtasks)
            await task.setSubtasks(values)
        }

        await task.update(req.body)

        const updatedTask = await Task.findOne({
            where: { id: req.params.id },
            include: [
                { model: Subtask, as: 'Subtasks' },
                {
                    model: Personnel,
                    as: 'Personnel',
                    through: { attributes: [] },
                },
            ],
        })

        res.json(updatedTask)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }

        await task.destroy()
        res.status(204).send({ message: 'Task deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
