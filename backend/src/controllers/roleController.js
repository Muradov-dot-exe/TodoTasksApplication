const Roles = require('../models/Roles')

exports.initializeRoles = async () => {
    try {
        const existingRoles = await Roles.findAll()

        if (existingRoles.length === 0) {
            await Roles.bulkCreate([
                { role_name: 'Employee' },
                { role_name: 'Manager' },
                { role_name: 'Admin' },
            ])
        }
    } catch (error) {
        console.error('Error initializing roles:', error.message)
    }
}
