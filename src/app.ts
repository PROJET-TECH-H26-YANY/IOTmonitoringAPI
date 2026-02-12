import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());             
app.use(express.json());     
app.use('/auth', authRoutes);
app.use('/api', studentRoutes);
app.get('/', (req, res) => {
  res.send(' API est en ligne !');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});