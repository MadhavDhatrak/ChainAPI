import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    patientId: {
        type: Number,
        unique: true,
        default: 1
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    condition: [{
        type: String,
        default: []
    }],
    interventions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Intervention'
    }]
}, { timestamps: true });

// Fixed auto-increment middleware
patientSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            console.log('Pre-save middleware executing...');
            const lastPatient = await this.constructor.findOne({})
                .sort({ patientId: -1 })
                .lean();
            console.log('Last patient:', lastPatient);
            this.patientId = lastPatient ? (lastPatient.patientId + 1) : 1;
            console.log('Generated patientId:', this.patientId);
        }
        next();
    } catch (error) {
        console.error('Middleware error:', error);
        next(error);
    }
});

export default mongoose.model('Patient', patientSchema);