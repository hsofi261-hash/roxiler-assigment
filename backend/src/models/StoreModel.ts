import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './UserModel';
import Rating from './RatingModel';

interface StoreAttributes {
  id: number;
  name: string;
  email: string;
  address: string;
  userId?: number;
}

interface StoreCreationAttributes extends Optional<StoreAttributes, 'id'> {}

class Store extends Model<StoreAttributes, StoreCreationAttributes> implements StoreAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public address!: string;
  public userId?: number;
}

Store.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING(400), allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: 'stores' }
);

// Associations
Store.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });

export default Store;