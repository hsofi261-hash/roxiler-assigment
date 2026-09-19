"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreOwnerDashboard = exports.getAdminDashboardStats = void 0;
const main_1 = require("../models/main");
const main_2 = require("../models/main");
const main_3 = require("../models/main");
// Get System Administrator Dashboard Statistics
const getAdminDashboardStats = async (req, res) => {
    try {
        // Fetch counts in parallel for optimal performance
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            main_2.User.count(),
            main_1.Store.count(),
            main_3.Rating.count()
        ]);
        return res.status(200).json({
            success: true,
            stats: {
                totalUsers, // Total number of users
                totalStores, // Total number of stores
                totalRatings // Total number of submitted ratings
            }
        });
    }
    catch (error) {
        console.error('Admin dashboard stats error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching admin dashboard stats.' });
    }
};
exports.getAdminDashboardStats = getAdminDashboardStats;
// Get Store Owner Dashboard Data
const getStoreOwnerDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }
        // Find all stores owned by the authenticated store owner
        const stores = await main_1.Store.findAll({
            where: { userId },
            include: [
                {
                    model: main_3.Rating,
                    as: 'ratings',
                    include: [
                        {
                            model: main_2.User,
                            as: 'user',
                            attributes: ['id', 'name', 'email', 'address']
                        }
                    ]
                }
            ]
        });
        // Format stores to include average rating and list of users who rated
        const storesWithDetails = stores.map(store => {
            const storeJson = store.toJSON();
            const ratingsList = storeJson.ratings || [];
            const totalRatings = ratingsList.length;
            // Calculate average rating[cite: 1]
            const averageRating = totalRatings > 0
                ? Number((ratingsList.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1))
                : 0;
            // Extract users who submitted ratings for this store[cite: 1]
            const ratingUsers = ratingsList.map((r) => ({
                ratingId: r.id,
                rating: r.rating,
                user: r.user
            }));
            return {
                id: storeJson.id,
                name: storeJson.name,
                email: storeJson.email,
                address: storeJson.address,
                averageRating, // Average rating of the store[cite: 1]
                totalRatings,
                ratedByUsers: ratingUsers // List of users who submitted ratings[cite: 1]
            };
        });
        return res.status(200).json({
            success: true,
            stores: storesWithDetails
        });
    }
    catch (error) {
        console.error('Store owner dashboard error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching store owner dashboard.' });
    }
};
exports.getStoreOwnerDashboard = getStoreOwnerDashboard;
