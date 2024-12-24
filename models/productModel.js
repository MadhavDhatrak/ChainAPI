// models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    patientId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['SERVICE', 'PRODUCT']
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;