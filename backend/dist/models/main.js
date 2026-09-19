"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = exports.Store = exports.User = void 0;
const UserModel_1 = __importDefault(require("./UserModel"));
exports.User = UserModel_1.default;
const StoreModel_1 = __importDefault(require("./StoreModel"));
exports.Store = StoreModel_1.default;
const RatingModel_1 = __importDefault(require("./RatingModel"));
exports.Rating = RatingModel_1.default;
// --- Define All Associations Here ---
// User Associations
UserModel_1.default.hasMany(StoreModel_1.default, { foreignKey: 'userId', as: 'stores' });
UserModel_1.default.hasMany(RatingModel_1.default, { foreignKey: 'userId', as: 'ratings' });
// Store Associations
StoreModel_1.default.belongsTo(UserModel_1.default, { foreignKey: 'userId', as: 'owner' });
StoreModel_1.default.hasMany(RatingModel_1.default, { foreignKey: 'storeId', as: 'ratings' });
// Rating Associations
RatingModel_1.default.belongsTo(UserModel_1.default, { foreignKey: 'userId', as: 'user' });
RatingModel_1.default.belongsTo(StoreModel_1.default, { foreignKey: 'storeId', as: 'store' });
