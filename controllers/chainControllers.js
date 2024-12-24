import Chain from '../models/ChainModel.js';
import Patient from '../models/patientModel.js';
import Product from '../models/productModel.js';
import Intervention from '../models/InterventionModel.js';
import { sendDiscordNotification } from '../services/discordService.js';

export const getFullChain = async (req, res) => {
    try {
        const { patientId } = req.query;
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        // Get patient details first
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Get chain entries with populated data
        const chain = await Chain.find({ patientId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'patient',
                select: 'name patientId age gender'
            });

        // Get related products
        const products = await Product.find({ patientId })
            .sort({ createdAt: -1 })
            .catch(err => {
                console.error('Product fetch error:', err);
                return [];
            });

        // Get related interventions
        const interventions = await Intervention.find({ patientId })
            .sort({ createdAt: -1 })
            .catch(err => {
                console.error('Intervention fetch error:', err);
                return [];
            });

            await sendDiscordNotification(`🔗  Fullchain for Patient ${patientId}`);
        res.status(200).json({
            status: 'success',
            data: {
                patient: {
                    id: patient._id,
                    patientId: patient.patientId,
                    name: patient.name,
                    age: patient.age,
                    gender: patient.gender
                },
                chainEntries: {
                    count: chain.length,
                    entries: chain
                },
                products: {
                    count: products.length,
                    entries: products
                },
                interventions: {
                    count: interventions.length,
                    entries: interventions
                }
            }
        });
    } catch (error) {
        console.error('Chain retrieval error:', error);
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
};

export const addToChain = async (req, res) => {
    try {
        const { patientId, type, notes } = req.body;

        if (!patientId || !type ) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['patientId', 'type', 'entityId']
            });
        }

        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const chainEntry = new Chain({
            patientId,
            type,
            notes,
            patient: patient._id
        });

        const savedEntry = await chainEntry.save();
        await sendDiscordNotification(`🔗 New entry added to chain for Patient ${patientId}`);

        res.status(201).json({
            status: 'success',
            data: savedEntry
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateChainStatus = async (req, res) => {
    try {
        const { patientId } = req.query;
        const { status, notes } = req.body;

        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const updatedEntry = await Chain.findOneAndUpdate(
            { patientId },
            { status, notes },
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ error: 'Chain entry not found' });
        }

        await sendDiscordNotification(`🔄 Chain status updated for Patient ${patientId}`);

        res.status(200).json({
            status: 'success',
            data: updatedEntry
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const removeFromChain = async (req, res) => {
    try {
        const { patientId } = req.query;

        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const deletedEntry = await Chain.findOneAndDelete({ patientId });

        if (!deletedEntry) {
            return res.status(404).json({ error: 'Chain entry not found' });
        }

        await sendDiscordNotification(`❌ Entry removed from chain for Patient ${patientId}`);

        res.status(200).json({
            status: 'success',
            message: 'Chain entry deleted successfully',
            data: deletedEntry
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};