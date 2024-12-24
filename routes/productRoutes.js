// routes/productRoutes.js
import express from 'express';
import {
    createProduct,
    getProductsByPatientId,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProductsByPatientId);
router.get('/:id', getProductById);
router.put('/', updateProduct);
router.delete('/', deleteProduct);

export default router;