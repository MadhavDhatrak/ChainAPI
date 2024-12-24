import express from 'express';
// import {
//     getFullChain,
//     addToChain,
//     updateChainStatus,
//     removeFromChain
// } from '../controllers/chainController.js';

import { getFullChain, addToChain, updateChainStatus, removeFromChain } from '../controllers/chainControllers.js';

const router = express.Router();

router.get('/', getFullChain);
router.post('/', addToChain);
router.put('/', updateChainStatus);
router.delete('/', removeFromChain);

export default router;