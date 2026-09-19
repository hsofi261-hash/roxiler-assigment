"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("./db")); // Adjust path to your sequelize instance
const main_1 = require("./models/main"); // Adjust path to your User model file
const seedAdmin = async () => {
    try {
        // 1. Connect to the database
        await db_1.default.authenticate();
        console.log('Database connection established successfully.');
        // 2. Check if ANY admin user already exists in the database
        const existingAdmin = await main_1.User.findOne({ where: { role: 'admin' } });
        if (existingAdmin) {
            console.log(`Admin user already exists (Email: ${existingAdmin.email}). Skipping seeding.`);
            process.exit(0);
        }
        // 3. Read admin details from environment variables
        const name = process.env.ADMIN_NAME || 'Super Admin';
        const email = process.env.ADMIN_EMAIL || 'admin@example.com';
        const plainPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        const address = process.env.ADMIN_ADDRESS || 'Headquarters';
        const role = 'admin';
        // 4. Double-check if the specific email is already taken by a non-admin user
        const existingEmail = await main_1.User.findOne({ where: { email } });
        if (existingEmail) {
            console.log(`A user with email "${email}" already exists. Skipping seeding.`);
            process.exit(0);
        }
        // 5. Hash the password for security
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(plainPassword, saltRounds);
        // 6. Create the admin user
        await main_1.User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role,
        });
        console.log('Admin user seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Failed to seed admin user:', error);
        process.exit(1);
    }
};
seedAdmin();
