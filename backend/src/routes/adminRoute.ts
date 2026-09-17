import { Router } from 'express';
import { getAdminDashboardStats, getStoreOwnerDashboard } from '../controller/AdminControll';
import { verifyToken, requireRole } from '../controller/AuthControll';

const router = Router();

// Admin Dashboard stats (Total users, stores, ratings)
router.get('/admin', verifyToken, requireRole(['admin']), getAdminDashboardStats);

// Store Owner Dashboard (Stores owned, ratings received, average rating)
router.get('/store-owner', verifyToken, requireRole(['store_owner']), getStoreOwnerDashboard);

export default router;