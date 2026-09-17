import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import Store from './StoreModel';
import Rating from './RatingModel';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  role: 'admin' | 'user' | 'store_owner';
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public address!: string;
  public role!: 'admin' | 'user' | 'store_owner';
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING(400), allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'user', 'store_owner'), defaultValue: 'user' },
  },
  { sequelize, tableName: 'users' }
);

// Associations
User.hasMany(Store, { foreignKey: 'userId', as: 'stores' });
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });

export default User;