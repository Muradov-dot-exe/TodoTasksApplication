const Personnel = require('../models/Personnel')
const Roles = require('../models/Roles')
const Task = require('../models/Task')
const { z } = require('zod')
const personnelSchema = require('../schema/personnelSchemaValidation')
const jwt = require('jsonwebtoken')

exports.createPersonnel = async (req, res) => {
    try {
        const validatedData = personnelSchema.parse(req.body)

        const employeeRole = await Roles.findOne({
            where: { role_name: 'Employee' },
        })

        if (!employeeRole) {
            return res.status(404).json({ error: 'Default role not found' })
        }

        const personnel = await Personnel.create({
            ...validatedData,
            role_id: employeeRole.id,
            role_name: employeeRole.role_name,
        })

        res.status(201).json(personnel)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors })
        }
        res.status(400).json({ error: error.message })
    }
}

exports.getUserInfo = async (req, res) => {
    const userId = req.session.id
    console.log(
        'User ID : ----------------------------------- --------------------- '
    )

    console.log(userId)
    const expiresIn = req.session.expiresIn
    if (expiresIn && Date.now() > expiresIn) {
        req.session = null
        res.clearCookie('token')
        return res
            .status(401)
            .json({ message: 'Session expired. User logged out.' })
    }

    try {
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        const personnel = await Personnel.findByPk(userId)
        if (!personnel) {
            return res.status(404).json({ message: 'User not found' })
        }

        const token = jwt.sign(
            {
                id: personnel.id,
                email: personnel.email,
                role: personnel.role_name,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.cookie('token', token, { httpOnly: true })

        req.session.expiresIn = Date.now() + 30 * 24 * 60 * 60 * 1000

        res.status(200).send({ user: personnel, token })
    } catch (error) {
        console.error('Error fetching user info:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.getAllPersonnel = async (req, res) => {
    try {
        const personnel = await Personnel.findAll({
            include: [
                {
                    model: Task,
                    as: 'Tasks',
                    through: { attributes: [] },
                },
            ],
        })

        res.json(personnel)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getPersonnelById = async (req, res) => {
    try {
        const { id } = req.params
        const personnel = await Personnel.findByPk(id, {
            include: [
                {
                    model: Task,
                    as: 'Tasks',
                    through: { attributes: [] },
                },
            ],
        })

        if (!personnel) {
            return res.status(404).json({ error: 'Personnel not found' })
        }

        res.json(personnel)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.updatePersonnel = async (req, res) => {
    try {
        const { id } = req.params
        const { role_id, role_name, ...otherData } = req.body

        const personnel = await Personnel.findByPk(id)

        if (!personnel) {
            return res.status(404).json({ error: 'Personnel not found' })
        }

        await personnel.update(otherData)

        if (role_id) {
            const role = await Roles.findByPk(role_id)

            if (!role) {
                return res.status(404).json({ error: 'Role not found' })
            }

            personnel.role_id = role_id
            personnel.role_name = role.role_name
        }

        if (role_name) {
            const role = await Roles.findOne({ where: { role_name } })

            if (!role) {
                return res.status(404).json({ error: 'Role not found' })
            }

            personnel.role_id = role.id
            personnel.role_name = role_name
        }

        await personnel.save()

        res.json(personnel)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.deletePersonnel = async (req, res) => {
    try {
        const personnel = await Personnel.findByPk(req.params.id)

        if (!personnel) {
            return res.status(404).json({ error: 'Personnel not found' })
        }

        await personnel.destroy()
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
