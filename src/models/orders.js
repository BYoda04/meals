const { db, DataTypes } = require('../DB/db');

//Model table
const Orders = db.define('orders', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
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
    Orders
};