const { Sequelize, DataTypes } = require('sequelize');

const host = process.env.HOST;
const user = process.env.DB_USER; 
const password = process.env.PASSWORD;
const port = process.env.DB_PORT;
const database = process.env.DATABASE;

const db = new Sequelize({
	dialect:'postgres',
	host,
	username: user,
	password,
	port,
	database,
	logging: false,
	dialectOptions: process.env.NODE_ENV === 'production' ? {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	} : {},
});

module.exports = { 
    db, 
    DataTypes 
};