import { Request, Response } from 'express';
import { Op, Sequelize } from 'sequelize';
import Store from '../models/StoreModel';
import User from '../models/UserModel';
import Rating from '../models/RatingModel';


//(with search/filters/sorting)
// Get all stores with search, filters (Name, Address), and sorting
export const getAllStores = async (req: Request, res: Response) => {
    try {
        const { search, name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;

        const whereClause: any = {};

        // General search across name and address
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { address: { [Op.like]: `%${search}%` } }
            ];
        }

        // Specific filters
        if (name) whereClause.name = { [Op.like]: `%${name}%` };
        if (address) whereClause.address = { [Op.like]: `%${address}%` };

        const stores = await Store.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Rating,
                    as: 'ratings',
                    attributes: ['id', 'rating', 'userId']
                }
            ],
            order: [[String(sortBy), String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC']]
        });

        // Calculate overall average rating for each store dynamically
        const storesWithRatings = stores.map(store => {
            // Type cast to 'any' to allow access to the included 'ratings' property
            const storeJson = store.toJSON() as any;
            const ratingsList = storeJson.ratings || [];
            const totalRatings = ratingsList.length;
            const averageRating = totalRatings > 0 
                ? Number((ratingsList.reduce((acc: number, curr: any) => acc + curr.rating, 0) / totalRatings).toFixed(1)) 
                : 0;

            return {
                ...storeJson,
                averageRating,
                totalRatings
            };
        });

        return res.status(200).json({
            success: true,
            count: storesWithRatings.length,
            stores: storesWithRatings,
        });
    } catch (error) {
        console.error('Get all stores error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching stores.' });
    }
};

// Get a single store by ID
export const getStoreById = async (req: Request, res: Response) => {
    try {
        const storeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        const store = await Store.findByPk(storeId, {
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Rating,
                    as: 'ratings',
                    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
                }
            ]
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found.' });
        }

        // Type cast to 'any' to allow access to included 'ratings' and 'owner' properties
        const storeJson = store.toJSON() as any;
        const ratingsList = storeJson.ratings || [];
        const averageRating = ratingsList.length > 0 
            ? Number((ratingsList.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ratingsList.length).toFixed(1)) 
            : 0;

        return res.status(200).json({
            success: true,
            store: {
                ...storeJson,
                averageRating,
                totalRatings: ratingsList.length
            }
        });
    } catch (error) {
        console.error('Get store by ID error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching store details.' });
    }
};

// Create a new store by Admin
export const createStore = async (req: Request, res: Response) => {
    try {
        const { name, email, address, userId } = req.body;

        // 1. Form Validations according to project requirements
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ message: 'Store name must be between 20 and 60 characters[cite: 1].' });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid store email format[cite: 1].' });
        }

        if (!address || address.length > 400) {
            return res.status(400).json({ message: 'Store address cannot exceed 400 characters[cite: 1].' });
        }

        // 2. Optional: If a userId (Store Owner) is provided, verify user exists and is a store owner
        if (userId) {
            const owner = await User.findByPk(userId);
            if (!owner) {
                return res.status(404).json({ message: 'Assigned store owner user not found.' });
            }
        }

        // 3. Create Store
        const newStore = await Store.create({
            name,
            email,
            address,
            userId: userId || null
        });

        return res.status(201).json({
            message: 'Store created successfully by admin[cite: 1].',
            store: newStore,
        });
    } catch (error) {
        console.error('Create store error:', error);
        return res.status(500).json({ message: 'Internal server error while creating store.' });
    }
};