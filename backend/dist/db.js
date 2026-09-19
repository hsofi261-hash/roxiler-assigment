"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = testConnection;
const sequelize_1 = require("sequelize");
const dbName = process.env.MYSQL_DATABASE;
const dbUser = process.env.MYSQL_USER;
const dbPassword = process.env.MYSQL_PASSWORD;
const dbHost = process.env.MYSQL_HOST || 'localhost'; // Fallback to localhost
const dbPort = Number(process.env.MYSQL_PORT) || 3306;
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost, // <--- Using the environment variable here
    port: dbPort,
    dialect: 'mysql',
    logging: false,
});
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('database is connected');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
exports.default = sequelize;
