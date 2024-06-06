const { Sequelize } = require('sequelize');
require('dotenv').config();

const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;
