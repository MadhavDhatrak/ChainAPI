import mongoose from "mongoose";

const chainSchema = new mongoose.Schema({
    patientId: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['INTERVENTION', 'PRODUCT', 'SERVICE']
    },
  
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: String,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
}, { timestamps: true });

const Chain = mongoose.model('Chain', chainSchema);
export default Chain;