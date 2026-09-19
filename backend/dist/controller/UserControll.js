"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const main_1 = require("../models/main");
const main_2 = require("../models/main");
const main_3 = require("../models/main");
// Get all users with filters (Name, Email, Address, Role) and sorting
const getAllUsers = async (req, res) => {
    try {
        const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
        // Build dynamic filter conditions
        const whereClause = {};
        if (name)
            whereClause.name = { [sequelize_1.Op.like]: `%${name}%` };
        if (email)
            whereClause.email = { [sequelize_1.Op.like]: `%${email}%` };
        if (address)
            whereClause.address = { [sequelize_1.Op.like]: `%${address}%` };
        if (role)
            whereClause.role = role;
        // Fetch users from database with associated stores and ratings (to show ratings if store owner)
        const users = await main_2.User.findAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: main_1.Store,
                    as: 'stores',
                    include: [{ model: main_3.Rating, as: 'ratings' }]
                }
            ],
            order: [[String(sortBy), String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC']]
        });
        return res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    }
    catch (error) {
        console.error('Get all users error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching users.' });
    }
};
exports.getAllUsers = getAllUsers;
// Get a single user by ID (including store ratings if store owner)
const getUserById = async (req, res) => {
    try {
        // Ensure id is treated as a single string/identifier
        const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const user = await main_2.User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: main_1.Store,
                    as: 'stores',
                    include: [{ model: main_3.Rating, as: 'ratings' }]
                }
            ]
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching user details.' });
    }
};
exports.getUserById = getUserById;
// Create a new user by Admin with project form validations
const createUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        // 1. Form Validations according to project requirements
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ message: 'Name must be between 20 and 60 characters[cite: 1].' });
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format[cite: 1].' });
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be 8-16 characters long and include at least one uppercase letter and one special character[cite: 1].'
            });
        }
        if (!address || address.length > 400) {
            return res.status(400).json({ message: 'Address cannot exceed 400 characters[cite: 1].' });
        }
        // 2. Check if email already exists
        const existingUser = await main_2.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }
        // 3. Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // 4. Create user (Admin can assign roles like 'admin', 'user', or 'store_owner')
        const newUser = await main_2.User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role: role || 'user',
        });
        // 5. Exclude password from response
        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        return res.status(201).json({
            message: 'User created successfully by admin[cite: 1].',
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({ message: 'Internal server error while creating user.' });
    }
};
exports.createUser = createUser;
