const { Sequelize, DataTypes } = require('sequelize');

const dialect = process.env.DIALECT;
const host = process.env.HOST;
//const username = process.env.USERNAME || 
const username = 'postgres';
const password = process.env.PASSWORD;
const port = process.env.DB_PORT;
const database = process.env.DATABASE;

const db = new Sequelize({
	dialect,
	host,
	username,
	password,
	port,
	database,
	logging: false,
});

module.exports = { 
    db, 
    DataTypes 
};