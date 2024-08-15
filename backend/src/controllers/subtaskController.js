const { PassThrough } = require('stream')
const Subtask = require('../models/Subtask')
const Task = require('../models/Task')
const subtaskSchema = require('../schema/subtaskSchemaValidation')
const { z } = require('zod')
const { axiosInstanceFileUpload } = require('../axiosConfig')
const FormData = require('form-data')
const { Sequelize } = require('sequelize')

exports.createSubtask = async (req, res) => {
    try {
        const validatedData = subtaskSchema.parse(req.body)
        const task = await Task.findByPk(validatedData.task_id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }

        const subtask = await Subtask.create(validatedData)
        res.status(201).json(subtask)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors })
        }
        res.status(400).json({ error: error.message })
    }
}

exports.getAllSubtasks = async (req, res) => {
    try {
        const subtasks = await Subtask.findAll()
        res.json(subtasks)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getSubtaskById = async (req, res) => {
    try {
        const subtask = await Subtask.findByPk(req.params.id)

        if (!subtask) {
            return res.status(404).json({ error: 'Subtask not found' })
        }
        res.json(subtask)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.updateSubtask = async (req, res) => {
    try {
        const subtask = await Subtask.findByPk(req.params.id)
        if (!subtask) {
            return res.status(404).json({ error: 'Subtask not found' })
        }
        await subtask.update(req.body)
        return res.json(subtask)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.deleteSubtask = async (req, res) => {
    try {
        const subtask = await Subtask.findByPk(req.params.id)
        if (!subtask) {
            return res.status(404).json({ error: 'Subtask not found' })
        }

        await subtask.destroy()
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.uploadImage = async (req, res) => {
    try {
        let form = new FormData()
        form.append('file', req.file.buffer, req.file.originalname)

        const uploadImage = await axiosInstanceFileUpload.post(
            '/upload',
            form,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
                },
            }
        )

        if (uploadImage?.data?.path) {
            await Subtask.update(
                {
                    images: Sequelize.fn(
                        'array_append',
                        Sequelize.col('images'),
                        uploadImage?.data?.path
                    ),
                },
                { where: { id: req.params.id } }
            )
        }
        res.status(201).json(uploadImage.data)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error })
    }
}

exports.addNote = async (req, res) => {
    try {
        await Subtask.update(
            {
                notes: Sequelize.fn(
                    'array_append',
                    Sequelize.col('notes'),
                    req.body.note
                ),
            },
            { where: { id: req.params.id } }
        )
        res.status(201).send()
    } catch (error) {
        console.error(error)
        res.status(400).json({ error })
    }
}

exports.deleteImage = async (req, res) => {
    try {
        await Subtask.update(
            {
                images: Sequelize.fn(
                    'array_remove',
                    Sequelize.col('images'),
                    req.params.name
                ),
            },
            { where: { id: req.params.id } }
        )

        res.status(201).send()
    } catch (error) {
        console.error(error)
        res.status(400).json({ error })
    }
}

exports.deleteNote = async (req, res) => {
    try {
        await Subtask.update(
            {
                notes: Sequelize.fn(
                    'array_remove',
                    Sequelize.col('notes'),
                    req.params.note
                ),
            },
            { where: { id: req.params.id } }
        )

        res.status(201).send()
    } catch (error) {
        console.error(error)
        res.status(400).json({ error })
    }
}
