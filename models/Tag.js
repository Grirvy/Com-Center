const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/CONN');

class Tag extends Model {}

Tag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        tag_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'John Doe'
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'tag'
    }
);

module.exports = Tag;