import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db/ConnectDB.js';
import patientRoutes from './routes/patientRoutes.js';
import interventionRoutes from './routes/interventionRoutes.js';
import productRoutes from './routes/productRoutes.js';
import chainRoutes from './routes/ChainRoutes.js';
dotenv.config();

const app = express();

const PORT= process.env.PORT || 5000;

app.use(express.json());
app.use('/api/patients', patientRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chain', chainRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})