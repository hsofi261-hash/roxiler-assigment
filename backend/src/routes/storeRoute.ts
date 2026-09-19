import { Router } from 'express';
import { getAllStores, getStoreById, createStore } from '../controller/StoreControll';
import { verifyToken, requireRole } from '../controller/AuthControll';

const router = Router();

router.get('/', verifyToken, getAllStores);                  // Get all stores with search/filters/sorting
router.get('/:id', verifyToken, getStoreById);               // Get store details by ID
router.post('/', verifyToken, requireRole(['store_owner']), createStore); // Create store by Store Owner

export default router;