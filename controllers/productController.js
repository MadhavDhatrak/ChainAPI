// controllers/productController.js
import Product from '../models/productModel.js';
import Patient from '../models/patientModel.js';
import { sendDiscordNotification } from '../services/discordService.js';

export const createProduct = async (req, res) => {
    try {
        const { patientId, name, type, category, description, cost } = req.body;
        console.log(patientId);

        // Validate required fields
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        if (!name || !type || !category || !description || !cost) {
            return res.status(400).json({ 
                error: 'Missing required fields', 
                required: ['patientId', 'name', 'type', 'category', 'description', 'cost']
            });
        }

        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const product = new Product({
            patientId: patient.patientId,
            name,
            type,
            category,
            description,
            cost,
            patient: patient._id
        });

        const savedProduct = await product.save();

        await sendDiscordNotification(
            `${product.type === 'SERVICE' ? '🏥' : '💊'} New ${product.type} added for Patient ${patient.patientId}: ${product.name}`
        );

        res.status(201).json({
            status: 'success',
            data: savedProduct
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(400).json({ 
            status: 'error',
            error: error.message 
        });
    }
};

export const getProductsByPatientId = async (req, res) => {
    try {
        const { patientId } = req.query;
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        const products = await Product.find({ patientId });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: 'Invalid product ID format' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { patientId } = req.query;  // Get patientId from query
        const { name, type, category, description, cost } = req.body;

        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required in query parameters' });
        }

        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { patientId },
            {
                name,
                type,
                category,
                description,
                cost,
                patient: patient._id
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            status: 'success',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(400).json({ error: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const { patientId } = req.query;

        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required in query parameters' });
        }

        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const deletedProduct = await Product.findOneAndDelete({ patientId });
        
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Discord notification not working because sendDiscordNotification needs to be imported
        try {
            await sendDiscordNotification(
                `❌ Deleted ${deletedProduct.type} for Patient ${deletedProduct.patientId}: ${deletedProduct.name}`
            );
        } catch (discordError) {
            console.error('Discord notification failed:', discordError);
            // Continue execution even if Discord notification fails
        }

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully',
            data: deletedProduct
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
};