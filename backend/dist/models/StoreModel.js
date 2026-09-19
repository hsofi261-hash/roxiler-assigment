"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class Store extends sequelize_1.Model {
    id;
    name;
    email;
    address;
    userId;
}
Store.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(60), allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    address: { type: sequelize_1.DataTypes.STRING(400), allowNull: false },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
}, { sequelize: db_1.default, tableName: 'stores' });
exports.default = Store;
