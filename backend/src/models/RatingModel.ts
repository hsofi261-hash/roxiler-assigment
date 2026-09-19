import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

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

export default Rating;