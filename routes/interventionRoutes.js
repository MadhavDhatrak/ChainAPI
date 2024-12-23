
import express from 'express';
const router=express.Router();
import {createIntervention, getInterventionsByPatientId, getInterventionById, updateIntervention, deleteIntervention, getAllInterventions} from '../controllers/interventionController.js';
router.post('/', createIntervention);
router.get('/', getInterventionsByPatientId); 
router.put('/', updateIntervention); 
router.delete('/', deleteIntervention); 
router.get('/all', getAllInterventions);

export default router;
