"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RatingControll_1 = require("../controller/RatingControll");
const AuthControll_1 = require("../controller/AuthControll");
const router = (0, express_1.Router)();
router.post('/', AuthControll_1.verifyToken, (0, AuthControll_1.requireRole)(['user']), RatingControll_1.submitRating); // Submit a rating for a store
router.put('/:id', AuthControll_1.verifyToken, (0, AuthControll_1.requireRole)(['user']), RatingControll_1.updateRating); // Update a submitted rating
exports.default = router;
