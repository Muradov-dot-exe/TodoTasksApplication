const { z } = require('zod')
const subtaskSchema = require('./subtaskSchemaValidation')

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    is_active: z.boolean(),
    current_status: z.string(),
    personnelIds: z.array(z.number()).optional(),
    subtasks: z.array(z.object(subtaskSchema.shape)).optional(),
})

module.exports = taskSchema
