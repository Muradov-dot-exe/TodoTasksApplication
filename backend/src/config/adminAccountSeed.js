const Personnel = require('../models/Personnel')
const Roles = require('../models/Roles')
const bcrypt = require('bcrypt')

const createAdminPersonnel = async () => {
    try {
        const existingAdmin = await Personnel.findOne({
            where: { email: process.env.ADMIN_E_MAIL },
        })

        if (existingAdmin) {
            return
        }

        const adminRole = await Roles.findOne({ where: { role_name: 'Admin' } })
        const adminPass = await bcrypt.hash(process.env.ADMIN_PASS, 10)

        if (!adminRole) {
            throw new Error('Admin role not found')
        }

        const adminPersonnel = await Personnel.create({
            first_name: process.env.ADMIN_F_NAME,
            last_name: process.env.ADMIN_L_NAME,
            email: process.env.ADMIN_E_MAIL,
            password: adminPass,
            is_available: true,
            role_id: adminRole.id,
            role_name: adminRole.role_name,
        })
    } catch (error) {
        console.error('Error creating admin personnel account:', error.message)
    }
}

module.exports = createAdminPersonnel
