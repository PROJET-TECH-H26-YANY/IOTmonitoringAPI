import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));              
app.use(express.json());      

console.log(' API REST prête pour Node-RED & Dashboard');


app.get('/', (req, res) => {
  res.send(' Backend IoT Running!');
});

app.listen(PORT, () => {
  console.log(` Serveur HTTP démarré sur http://localhost:${PORT}`);
});


export default app;

