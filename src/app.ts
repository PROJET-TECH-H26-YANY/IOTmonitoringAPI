import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import iotRoutes from './routes/iotRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Remplace app.use(cors()); par ceci :
app.use(cors({
  // Ajoute l'URL de ton front local, et éventuellement celle de production plus tard
  origin: ['http://localhost:8081', 'exp://192.168.1.x:8081'], 
  credentials: true, // Indispensable pour matcher avec le 'include' de ton front
}));             
app.use(express.json());     
app.use('/auth', authRoutes);
app.use('/api', studentRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', iotRoutes);
app.get('/', (req, res) => {
  res.send(' API est en ligne !');
});

export default app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(` Serveur démarré sur http://localhost:${PORT}`);
  });
}
