const { DataTypes } = require('sequelize')
const sequelize = require('../config/dbconnection')

const Roles = sequelize.define(
    'Roles',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role_name: { type: DataTypes.STRING, allowNull: false },
    },
    {
        tableName: 'Roles',
    }
)

module.exports = Roles
