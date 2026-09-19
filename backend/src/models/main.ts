import User from './UserModel';
import Store from './StoreModel';
import Rating from './RatingModel';

// --- Define All Associations Here ---

// User Associations
User.hasMany(Store, { foreignKey: 'userId', as: 'stores' });
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });

// Store Associations
Store.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });

// Rating Associations
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

export { User, Store, Rating };