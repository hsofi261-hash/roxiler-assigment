"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRating = exports.submitRating = void 0;
const main_1 = require("../models/main");
const main_2 = require("../models/main");
// Submit a new rating (1 to 5) for a store
const submitRating = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }
        const { storeId, rating } = req.body;
        // 1. Validate rating value (must range from 1 to 5)
        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be an integer between 1 and 5[cite: 1].' });
        }
        // 2. Check if the store exists
        const store = await main_1.Store.findByPk(storeId);
        if (!store) {
            return res.status(404).json({ message: 'Store not found.' });
        }
        // 3. Check if the user has already submitted a rating for this store
        const existingRating = await main_2.Rating.findOne({ where: { userId, storeId } });
        if (existingRating) {
            return res.status(400).json({
                message: 'You have already submitted a rating for this store. Please use update rating instead[cite: 1].'
            });
        }
        // 4. Create the rating entry
        const newRating = await main_2.Rating.create({
            rating,
            userId,
            storeId
        });
        return res.status(201).json({
            message: 'Rating submitted successfully[cite: 1].',
            rating: newRating
        });
    }
    catch (error) {
        console.error('Submit rating error:', error);
        return res.status(500).json({ message: 'Internal server error while submitting rating.' });
    }
};
exports.submitRating = submitRating;
// Update an existing rating
const updateRating = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }
        const ratingId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { rating } = req.body;
        // 1. Validate rating value (must range from 1 to 5)
        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be an integer between 1 and 5[cite: 1].' });
        }
        // 2. Find the existing rating by ID
        const existingRating = await main_2.Rating.findByPk(ratingId);
        if (!existingRating) {
            return res.status(404).json({ message: 'Rating not found.' });
        }
        // 3. Ensure the authenticated user owns this rating
        if (existingRating.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden. You can only modify your own ratings[cite: 1].' });
        }
        // 4. Update and save the rating
        existingRating.rating = rating;
        await existingRating.save();
        return res.status(200).json({
            message: 'Rating updated successfully[cite: 1].',
            rating: existingRating
        });
    }
    catch (error) {
        console.error('Update rating error:', error);
        return res.status(500).json({ message: 'Internal server error while updating rating.' });
    }
};
exports.updateRating = updateRating;
