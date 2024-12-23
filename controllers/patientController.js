// controllers/patientController.js
import Patient from '../models/patientModel.js';
import { sendDiscordNotification,NOTIFICATION_TEMPLATES } from '../services/discordService.js';

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
            await sendDiscordNotification(NOTIFICATION_TEMPLATES.PATIENT.CREATE(savedPatient.name, savedPatient.patientId));
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

            await sendDiscordNotification(NOTIFICATION_TEMPLATES.PATIENT.GET("All Patients", "BULK"));
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
        
        await sendDiscordNotification(NOTIFICATION_TEMPLATES.PATIENT.GET("All Patients", "BULK"));
        res.status(200).json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ error: 'Invalid patient ID format' });
    }
};
// Update a patient
export const updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        ).populate('interventions');

        if (!updatedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        await sendDiscordNotification(
            NOTIFICATION_TEMPLATES.PATIENT.UPDATE(
                updatedPatient.name, 
                updatedPatient.patientId
            )
        );

        res.status(200).json(updatedPatient);
    } catch (error) {
        console.error('Update error:', error);
        res.status(400).json({ error: 'Unable to update patient' });
    }
};
// Delete a patient
export const deletePatient = async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        
        if (!deletedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        await sendDiscordNotification(
            NOTIFICATION_TEMPLATES.PATIENT.DELETE(
                deletedPatient.name, 
                deletedPatient.patientId
            )
        );

        // Change from 204 to 200 to show message
        res.status(200).json({ 
            message: 'Patient deleted successfully',
            patient: deletedPatient
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};