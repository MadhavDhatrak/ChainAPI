
import express from 'express';
import { createPatient, deletePatient, getAllPatients,  getPatientById , updatePatient } from '../controllers/patientController.js';
const router = express.Router();

// Define routes for patients
router.post('/',createPatient); // Create a new patient
router.get('/', getAllPatients); // Get all patients
router.get('/:id', getPatientById ); // Get patient by ID
router.put('/:id', updatePatient); // Update a patient
router.delete('/:id',deletePatient); // Delete a patient

export default router;
