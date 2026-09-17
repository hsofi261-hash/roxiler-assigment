import { Request, Response } from 'express';
import Store from '../models/StoreModel';
import User from '../models/UserModel';
import Rating from '../models/RatingModel';



// Get System Administrator Dashboard Statistics
export const getAdminDashboardStats = async (req: Request, res: Response) => {
    try {
        // Fetch counts in parallel for optimal performance
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            User.count(),
            Store.count(),
            Rating.count()
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,   // Total number of users[cite: 1]
                totalStores,  // Total number of stores[cite: 1]
                totalRatings  // Total number of submitted ratings[cite: 1]
            }
        });
    } catch (error) {
        console.error('Admin dashboard stats error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching admin dashboard stats.' });
    }
};

// Get Store Owner Dashboard Data
export const getStoreOwnerDashboard = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        // Find all stores owned by the authenticated store owner
        const stores = await Store.findAll({
            where: { userId },
            include: [
                {
                    model: Rating,
                    as: 'ratings',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'email', 'address']
                        }
                    ]
                }
            ]
        });

        // Format stores to include average rating and list of users who rated
        const storesWithDetails = stores.map(store => {
            const storeJson = store.toJSON() as any;
            const ratingsList = storeJson.ratings || [];
            const totalRatings = ratingsList.length;
            
            // Calculate average rating[cite: 1]
            const averageRating = totalRatings > 0
                ? Number((ratingsList.reduce((acc: number, curr: any) => acc + curr.rating, 0) / totalRatings).toFixed(1))
                : 0;

            // Extract users who submitted ratings for this store[cite: 1]
            const ratingUsers = ratingsList.map((r: any) => ({
                ratingId: r.id,
                rating: r.rating,
                user: r.user
            }));

            return {
                id: storeJson.id,
                name: storeJson.name,
                email: storeJson.email,
                address: storeJson.address,
                averageRating,      // Average rating of the store[cite: 1]
                totalRatings,
                ratedByUsers: ratingUsers // List of users who submitted ratings[cite: 1]
            };
        });

        return res.status(200).json({
            success: true,
            stores: storesWithDetails
        });
    } catch (error) {
        console.error('Store owner dashboard error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching store owner dashboard.' });
    }
};