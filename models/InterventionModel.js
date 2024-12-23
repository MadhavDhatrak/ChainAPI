import mongoose from "mongoose";

const interventionsSchema = new mongoose.Schema({
    patientId:{
        type:Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    
    date: { type: Date, default: Date.now }
},{timestamps:true});

const Intervention = mongoose.model('Intervention', interventionsSchema);
export default Intervention;