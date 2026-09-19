"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminControll_1 = require("../controller/AdminControll");
const AuthControll_1 = require("../controller/AuthControll");
const router = (0, express_1.Router)();
// Admin Dashboard stats (Total users, stores, ratings)
router.get('/admin', AuthControll_1.verifyToken, (0, AuthControll_1.requireRole)(['admin']), AdminControll_1.getAdminDashboardStats);
// Store Owner Dashboard (Stores owned, ratings received, average rating)
router.get('/store-owner', AuthControll_1.verifyToken, (0, AuthControll_1.requireRole)(['store_owner']), AdminControll_1.getStoreOwnerDashboard);
exports.default = router;
