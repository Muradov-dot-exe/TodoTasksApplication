const { z } = require('zod')

const personnelSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be longer than 6 characters'),
    is_available: z.boolean().default(true),
})

module.exports = personnelSchema
