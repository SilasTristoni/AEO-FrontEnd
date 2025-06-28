const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Category = database.db.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = Category;