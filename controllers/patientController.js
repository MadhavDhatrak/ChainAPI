// controllers/patientController.js
import Patient from '../models/patientModel.js';

// Create a new patient
export const createPatient = async (req, res) => {
    try {
        const patientData = {
            name: req.body.name,
            age: req.body.age,
            condition: Array.isArray(req.body.condition) ? req.body.condition : []
        };
        
        const patient = new Patient(patientData);
        await patient.save();
        
        const savedPatient = await Patient.findById(patient._id)
            .populate('interventions')
            .select('+patientId');
            
        res.status(201).json(savedPatient);
    } catch (error) {
        console.error("Error creating patient:", error);
        res.status(400).json({ error: error.message });
    }
};
// Get all patients
export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find()
            .populate({
                path: 'interventions',
                select: 'description date patientId'
            });
        res.status(200).json(patients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a patient by ID
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
            .populate('interventions');
            
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        res.status(200).json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ error: 'Invalid patient ID format' });
    }
};
// Update a patient
export const updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('interventions');
        if (!updatedPatient) return res.status(404).json({ error: 'Patient not found' });
        res.status(200).json(updatedPatient);
    } catch (error) {
        res.status(400).json({ error: 'Unable to update patient' });
    }
};

// Delete a patient
export const deletePatient = async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        if (!deletedPatient) return res.status(404).json({ error: 'Patient not found' });
        res.status(204).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
