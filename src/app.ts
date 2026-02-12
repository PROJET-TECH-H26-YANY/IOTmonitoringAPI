import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes';
import iotRoutes from './routes/iotRoutes'; // 1. On décommente ça

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));              
app.use(express.json());      

// 2. On a supprimé "new MqttService()" car c'est Node-RED qui gère le MQTT maintenant.
console.log(' API REST prête pour Node-RED & Dashboard');

app.use('/api', adminRoutes);
app.use('/api', iotRoutes); // 3. On active les routes pour Node-RED

app.get('/', (req, res) => {
  res.send(' Backend IoT Running!');
});

app.listen(PORT, () => {
  console.log(` Serveur HTTP démarré sur http://localhost:${PORT}`);
});


export default app;

// Si ce fichier est lancé directement (node dist/app.js), on démarre le serveur
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(` Serveur HTTP démarré sur http://localhost:${PORT}`);
  });
}