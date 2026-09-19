"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserControll_1 = require("../controller/UserControll");
const AuthControll_1 = require("../controller/AuthControll");
const router = (0, express_1.Router)();
// System Administrator routes
router.get('/', AuthControll_1.verifyToken, (0, AuthControll_1.requireRole)(['admin']), UserControll_1.getAllUsers); // Get all users with filters/sorting
router.get('/:id', AuthControll_1.verifyToken, UserControll_1.getUserById); // Get user details by ID
router.post('/', AuthControll_1.verifyToken, (0, AuthControll_1.requireRole)(['admin']), UserControll_1.createUser); // Create user by Admin
exports.default = router;
