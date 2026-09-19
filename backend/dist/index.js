"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const storeRoute_1 = __importDefault(require("./routes/storeRoute"));
const ratingRoute_1 = __importDefault(require("./routes/ratingRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const app = (0, express_1.default)();
const PORT = process.env.BACKEND_PORT || 7000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/auth', authRoute_1.default);
app.use('/api/users', userRoute_1.default);
app.use('/api/stores', storeRoute_1.default);
app.use('/api/ratings', ratingRoute_1.default);
app.use('/api/admin', adminRoute_1.default);
const startServer = async () => {
    try {
        // Test the database connection
        await db_1.default.authenticate();
        console.log('Database connection established successfully.');
        // 2. Synchronize models with the database (Creates tables if they don't exist)
        // use { alter: true } during development to update tables if models change safely
        await db_1.default.sync({ alter: true });
        console.log('Database synchronized and tables created.');
        // Start Express server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
startServer();
