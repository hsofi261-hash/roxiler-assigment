import express from "express"; 
import cors from "cors";
import sequelize from "./db";

import authRoutes from './routes/authRoute';
import userRoutes from './routes/userRoute';
import storeRoutes from './routes/storeRoute';
import ratingRoutes from './routes/ratingRoute';
import adminRoutes from './routes/adminRoute';

const app = express();
const PORT = process.env.BACKEND_PORT || 7000;

app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);


const startServer = async () => {
    try {
        // Test the database connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // 2. Synchronize models with the database (Creates tables if they don't exist)
        // use { alter: true } during development to update tables if models change safely
        await sequelize.sync({ alter: true }); 
        console.log('Database synchronized and tables created.');

        // Start Express server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();