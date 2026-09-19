"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class Rating extends sequelize_1.Model {
    id;
    rating;
    userId;
    storeId;
}
Rating.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rating: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    storeId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
}, { sequelize: db_1.default, tableName: 'ratings' });
exports.default = Rating;
