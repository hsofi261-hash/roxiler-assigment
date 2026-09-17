import express from "express";
import { testConnection } from "./db"; 
import cors from "cors";

import authRoutes from './routes/authRoute';
import userRoutes from './routes/userRoute';
import storeRoutes from './routes/storeRoute';
import ratingRoutes from './routes/ratingRoute';
import adminRoutes from './routes/adminRoute';

const app = express();
const port = process.env.BACKEND_PORT || 7000;

app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Test the database connection using the imported function
testConnection();