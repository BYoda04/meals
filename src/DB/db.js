const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const db = new Sequelize({
	dialect: 'postgres',
	host: process.env.HOST,
	username: process.env.DB_USER,
	password: process.env.PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DATABASE,
	logging: false,
	dialectOptions: process.env.NODE_ENV === 'production' ? {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	} : {},
});

console.log(db);

module.exports = { 
    db, 
    DataTypes 
};