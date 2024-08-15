const { z } = require('zod')

const subtaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    notes: z.array(z.string()),
    images: z.array(z.string()),
    number_of_required_images: z
        .number()
        .int()
        .positive()
        .min(1, 'Number of required images must be at least 1'),
    number_of_required_notes: z
        .number()
        .int()
        .positive()
        .min(1, 'Number of required notes must be at least 1'),
    is_completed: z.boolean(),
    task_id: z
        .number()
        .int()
        .positive('task_id must be a positive integer')
        .optional(),
})

module.exports = subtaskSchema
