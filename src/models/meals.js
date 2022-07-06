const { db, DataTypes } = require('../DB/db');

//Model table
const Meals = db.define('meals', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
		defaultValue: 'active',
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = {
    Meals
};