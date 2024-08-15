const { DataTypes } = require('sequelize')
const sequelize = require('../config/dbconnection')

const Personnel = sequelize.define(
    'Personnel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        is_available: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        role_id: { type: DataTypes.INTEGER, allowNull: false },
        role_name: { type: DataTypes.STRING, allowNull: false },
    },
    {
        tableName: 'Personnel',
    }
)

module.exports = Personnel
