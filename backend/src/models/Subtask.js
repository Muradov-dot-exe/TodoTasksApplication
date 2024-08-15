const { DataTypes } = require('sequelize')
const sequelize = require('../config/dbconnection')
const Task = require('./Task')

const Subtask = sequelize.define(
    'Subtask',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        notes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
        images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
        number_of_required_images: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        number_of_required_notes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        is_completed: { type: DataTypes.BOOLEAN, allowNull: false },
        task_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Task,
                key: 'id',
            },
        },
    },
    {
        tableName: 'Subtasks',
    }
)

module.exports = Subtask
