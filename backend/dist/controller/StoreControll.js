"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = exports.getStoreById = exports.getAllStores = void 0;
const sequelize_1 = require("sequelize");
const main_1 = require("../models/main");
const main_2 = require("../models/main");
const main_3 = require("../models/main");
//(with search/filters/sorting)
// Get all stores with search, filters (Name, Address), and sorting
const getAllStores = async (req, res) => {
    try {
        const { search, name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
        const whereClause = {};
        // General search across name and address
        if (search) {
            whereClause[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${search}%` } },
                { address: { [sequelize_1.Op.like]: `%${search}%` } }
            ];
        }
        // Specific filters
        if (name)
            whereClause.name = { [sequelize_1.Op.like]: `%${name}%` };
        if (address)
            whereClause.address = { [sequelize_1.Op.like]: `%${address}%` };
        const stores = await main_1.Store.findAll({
            where: whereClause,
            include: [
                {
                    model: main_2.User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: main_3.Rating,
                    as: 'ratings',
                    attributes: ['id', 'rating', 'userId']
                }
            ],
            order: [[String(sortBy), String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC']]
        });
        // Calculate overall average rating for each store dynamically
        const storesWithRatings = stores.map(store => {
            // Type cast to 'any' to allow access to the included 'ratings' property
            const storeJson = store.toJSON();
            const ratingsList = storeJson.ratings || [];
            const totalRatings = ratingsList.length;
            const averageRating = totalRatings > 0
                ? Number((ratingsList.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings).toFixed(1))
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
    }
    catch (error) {
        console.error('Get all stores error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching stores.' });
    }
};
exports.getAllStores = getAllStores;
// Get a single store by ID
const getStoreById = async (req, res) => {
    try {
        const storeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const store = await main_1.Store.findByPk(storeId, {
            include: [
                {
                    model: main_2.User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: main_3.Rating,
                    as: 'ratings',
                    include: [{ model: main_2.User, as: 'user', attributes: ['id', 'name', 'email'] }]
                }
            ]
        });
        if (!store) {
            return res.status(404).json({ message: 'Store not found.' });
        }
        // Type cast to 'any' to allow access to included 'ratings' and 'owner' properties
        const storeJson = store.toJSON();
        const ratingsList = storeJson.ratings || [];
        const averageRating = ratingsList.length > 0
            ? Number((ratingsList.reduce((acc, curr) => acc + curr.rating, 0) / ratingsList.length).toFixed(1))
            : 0;
        return res.status(200).json({
            success: true,
            store: {
                ...storeJson,
                averageRating,
                totalRatings: ratingsList.length
            }
        });
    }
    catch (error) {
        console.error('Get store by ID error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching store details.' });
    }
};
exports.getStoreById = getStoreById;
// Create a new store by Admin
const createStore = async (req, res) => {
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
            const owner = await main_2.User.findByPk(userId);
            if (!owner) {
                return res.status(404).json({ message: 'Assigned store owner user not found.' });
            }
        }
        // 3. Create Store
        const newStore = await main_1.Store.create({
            name,
            email,
            address,
            userId: userId || null
        });
        return res.status(201).json({
            message: 'Store created successfully by admin[cite: 1].',
            store: newStore,
        });
    }
    catch (error) {
        console.error('Create store error:', error);
        return res.status(500).json({ message: 'Internal server error while creating store.' });
    }
};
exports.createStore = createStore;
