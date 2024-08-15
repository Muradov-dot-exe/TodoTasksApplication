const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Personnel = require('../models/Personnel')
const Roles = require('../models/Roles')
const { z } = require('zod')
const personnelSchema = require('../schema/personnelSchemaValidation')

exports.register = async (req, res) => {
    try {
        const validatedData = personnelSchema.parse(req.body)

        const existingUser = await Personnel.findOne({
            where: { email: validatedData.email },
        })
        if (existingUser) {
            return res
                .status(400)
                .json({ error: 'Email is already registered' })
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10)

        const defaultRole = await Roles.findOne({
            where: { role_name: 'Employee' },
        })
        if (!defaultRole) {
            return res.status(404).json({ error: 'Default role not found' })
        }

        const newUser = await Personnel.create({
            ...validatedData,
            password: hashedPassword,
            role_id: defaultRole.id,
            role_name: defaultRole.role_name,
        })

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors })
        }
        res.status(400).json({ error: error.message })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await Personnel.findOne({ where: { email } })
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role_name,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        req.session.token = token
        req.session.id = user.id
        req.session.first_name = user.first_name
        req.session.last_name = user.last_name
        req.session.expiresIn = Date.now() + 86400000
        req.session.email = user.email

        res.cookie('token', token, { httpOnly: true })

        res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            accessToken: token,
            role_name: user.role_name,
            role_id: user.role_id,
            is_available: user.is_available,
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.logout = (req, res) => {
    try {
        req.session = null
        res.clearCookie('session')
        res.clearCookie('token')
        res.clearCookie('session.sig')
        res.status(200).send({ message: 'Sign-out successful!' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            return res
                .status(401)
                .json({ message: 'Access denied. No token provided.' })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken

        const currentTime = Date.now()
        if (decodedToken.exp * 1000 < currentTime) {
            req.session = null
            res.clearCookie('token')
            return res
                .status(401)
                .json({ message: 'Token expired. Please log in again.' })
        }

        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}
