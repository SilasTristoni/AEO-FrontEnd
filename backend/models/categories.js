const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Category = database.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = Category;