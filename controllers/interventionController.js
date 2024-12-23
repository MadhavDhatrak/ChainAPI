
// Log a new intervention
import Intervention from '../models/InterventionModel.js';
import Patient from '../models/patientModel.js';

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
        res.status(200).json(intervention);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update an intervention
// Update an intervention
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
        res.status(200).json(intervention);
    } catch (error) {
        console.error('Update error:', error);
        res.status(400).json({ error: 'Unable to update intervention' });
    }
};

// Delete an intervention
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
        res.status(200).json({ message: 'Intervention deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


export const getAllInterventions = async (req, res) => {
    try {
        const interventions = await Intervention.find()
            .sort({ date: -1 });
        res.status(200).json(interventions);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};