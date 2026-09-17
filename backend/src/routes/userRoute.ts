import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../controller/UserControll';
import { verifyToken, requireRole } from '../controller/AuthControll';

const router = Router();

// System Administrator routes
router.get('/', verifyToken, requireRole(['admin']), getAllUsers);       // Get all users with filters/sorting
router.get('/:id', verifyToken, getUserById);                             // Get user details by ID
router.post('/', verifyToken, requireRole(['admin']), createUser);       // Create user by Admin

export default router;