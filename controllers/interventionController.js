
// Log a new intervention
import Intervention from '../models/InterventionModel.js';
import Patient from '../models/patientModel.js';
import { sendDiscordNotification, NOTIFICATION_TEMPLATES } from '../services/discordService.js';
export const createIntervention = async (req, res) => {
    try {
        const patient = await Patient.findOne({ patientId: req.body.patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const intervention = new Intervention({
            patientId: patient.patientId,
            description: req.body.description,
            date: new Date()
        });

        const savedIntervention = await intervention.save();
        
        // Update patient's interventions array
        patient.interventions.push(savedIntervention._id);
        await patient.save();

        await sendDiscordNotification(
            NOTIFICATION_TEMPLATES.INTERVENTION.CREATE(
                patient.patientId,
                savedIntervention.description
            )
        );

        res.status(201).json(savedIntervention);
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ error: 'Unable to create intervention' });
    }
};

// Get all interventions for a specific patient
export const getInterventionsByPatientId = async (req, res) => {
    try {
        const patient = await Patient.findOne({ patientId: req.query.patientId })
            .populate('interventions');
        
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        await sendDiscordNotification(NOTIFICATION_TEMPLATES.PATIENT.GET("All Patients", "BULK"));
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};



// Get an intervention by ID
export const getInterventionById = async (req, res) => {
    try {
        const intervention = await Intervention.findById(req.params.id);
        if (!intervention) return res.status(404).json({ error: 'Intervention not found' });
        await sendDiscordNotification(NOTIFICATION_TEMPLATES.PATIENT.GET("All Patients", "BULK"));
        res.status(200).json(intervention);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update an intervention
// ...existing code...

// Update intervention (rename from updatePatient to updateIntervention)
export const updateIntervention = async (req, res) => {
    try {
        const patientId = req.query.patientId;
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const intervention = await Intervention.findOneAndUpdate(
            { patientId: patientId },
            req.body,
            { new: true }
        );

        if (!intervention) {
            return res.status(404).json({ error: 'Intervention not found' });
        }

        await sendDiscordNotification(
            NOTIFICATION_TEMPLATES.INTERVENTION.UPDATE(
                intervention.patientId,
                intervention.description
            )
        );

        res.status(200).json(intervention);
    } catch (error) {
        console.error('Update error:', error);
        res.status(400).json({ error: 'Unable to update intervention' });
    }
};


export const deleteIntervention = async (req, res) => {
    try {
        const patientId = req.query.patientId;
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const intervention = await Intervention.findOneAndDelete({ patientId: patientId });
        
        if (!intervention) {
            return res.status(404).json({ error: 'Intervention not found' });
        }

        await sendDiscordNotification(
            NOTIFICATION_TEMPLATES.INTERVENTION.DELETE(
                intervention.patientId
            )
        );

        res.status(200).json({ 
            message: 'Intervention deleted successfully',
            deletedIntervention: intervention 
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getAllInterventions = async (req, res) => {
    try {
        const interventions = await Intervention.find()
            .sort({ date: -1 });

            await sendDiscordNotification(NOTIFICATION_TEMPLATES.PATIENT.GET("All Patients", "BULK"));
        res.status(200).json(interventions);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};