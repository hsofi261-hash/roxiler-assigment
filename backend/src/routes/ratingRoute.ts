import { Router } from 'express';
import { submitRating, updateRating } from '../controller/RatingControll';
import { verifyToken, requireRole } from '../controller/AuthControll';

const router = Router();

router.post('/', verifyToken, submitRating);     // Submit a rating for a store
router.put('/:id', verifyToken, updateRating);   // Update a submitted rating

export default router;