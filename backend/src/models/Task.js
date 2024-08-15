const { DataTypes } = require('sequelize')
const sequelize = require('../config/dbconnection')

const Task = sequelize.define(
    'Task',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        start_date: { type: DataTypes.DATE, allowNull: false },
        end_date: { type: DataTypes.DATE, allowNull: false },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false },
        current_status: { type: DataTypes.STRING, allowNull: false },
    },
    {
        tableName: 'Tasks',
    }
)

module.exports = Task
