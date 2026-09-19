import express from 'express';
import { signup, login, logout, checkAuth, updatePassword, verifyToken, requireRole } from '../controller/AuthControll';


const router = express.Router();

// Signup route
router.post('/signup', signup);                  
router.post('/login', login);                    
router.post('/logout', verifyToken, logout);     
router.put('/update-password', verifyToken, updatePassword);
router.get('/check-user', verifyToken, checkAuth);
router.get('/check-store', verifyToken, requireRole(['store_owner']), checkAuth); 
router.get('/check-admin', verifyToken, requireRole(['admin']), checkAuth); 

export default router;
