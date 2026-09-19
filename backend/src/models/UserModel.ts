import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

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
  // Use 'declare' so TypeScript knows these map to Sequelize attributes without shadowing getters/setters
  declare public id: number;
  declare public name: string;
  declare public email: string;
  declare public password: string;
  declare public address: string;
  declare public role: 'admin' | 'user' | 'store_owner';
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

export default User;