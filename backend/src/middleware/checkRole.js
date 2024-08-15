const jwt = require('jsonwebtoken')
const Personnel = require('../models/Personnel')

const checkRole = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const token =
                req.cookies.token || req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            const user = await Personnel.findByPk(decodedToken.id)

            if (!user) {
                return res.status(401).json({ message: 'User not found' })
            }

            if (!requiredRoles.includes(user.role_name)) {
                return res.status(403).json({ message: 'Access denied' })
            }

            req.user = user
            next()
        } catch (error) {
            res.status(401).json({ message: 'Authentication failed' })
        }
    }
}

module.exports = checkRole
