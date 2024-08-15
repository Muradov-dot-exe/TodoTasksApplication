const Personnel = require('../models/Personnel')
const Task = require('../models/Task')
const Subtask = require('../models/Subtask')
const Roles = require('../models/Roles')

function setupAssociations() {
    Task.hasMany(Subtask, {
        foreignKey: 'task_id',
        onDelete: 'CASCADE',
        as: 'Subtasks',
    })
    Subtask.belongsTo(Task, {
        foreignKey: 'task_id',
        as: 'Subtasks',
    })

    Task.belongsToMany(Personnel, { through: 'TaskPersonnel', as: 'Personnel' })
    Personnel.belongsToMany(Task, { through: 'TaskPersonnel', as: 'Tasks' })
    Personnel.belongsTo(Roles, { foreignKey: 'role_id' })
}

module.exports = setupAssociations
