"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StoreControll_1 = require("../controller/StoreControll");
const AuthControll_1 = require("../controller/AuthControll");
const router = (0, express_1.Router)();
router.get('/', AuthControll_1.verifyToken, StoreControll_1.getAllStores); // Get all stores with search/filters/sorting
router.get('/:id', AuthControll_1.verifyToken, StoreControll_1.getStoreById); // Get store details by ID
router.post('/', AuthControll_1.verifyToken, (0, AuthControll_1.requireRole)(['admin']), StoreControll_1.createStore); // Create store by Admin
exports.default = router;
