const { db, DataTypes } = require('../DB/db');

//Model table
const Restaurants = db.define('restaurants', {
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
    addres: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
		defaultValue: 'active',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = {
    Restaurants
};