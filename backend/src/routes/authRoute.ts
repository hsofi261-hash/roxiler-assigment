import express from 'express';
import { signup, login, logout, checkAuth, updatePassword, verifyToken, requireRole } from '../controller/AuthControll';


const router = express.Router();

// Signup route
router.post('/signup', signup);                  
router.post('/login', login);                    
router.post('/logout', verifyToken, logout);     
router.put('/password', verifyToken, updatePassword);
router.get('/check', verifyToken, checkAuth);

export default router;
