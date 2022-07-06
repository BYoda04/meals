const { db, DataTypes } = require('../DB/db');
const { Orders } = require('./orders');
const { Petitions } = require('./petitions');

//models

//model table
const PetitionsInOrder = db.define('petitionsInOrder',{
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Orders,
            key: 'id'
        }
    },
    petitionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Petitions,
            key: id
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
		defaultValue: 'active',
    }
});

module.exports = { PetitionsInOrder };