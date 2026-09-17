import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './UserModel';
import Store from './StoreModel';

interface RatingAttributes {
  id: number;
  rating: number;
  userId: number;
  storeId: number;
}

interface RatingCreationAttributes extends Optional<RatingAttributes, 'id'> {}

class Rating extends Model<RatingAttributes, RatingCreationAttributes> implements RatingAttributes {
  public id!: number;
  public rating!: number;
  public userId!: number;
  public storeId!: number;
}

Rating.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    storeId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'ratings' }
);

// Associations
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

export default Rating;