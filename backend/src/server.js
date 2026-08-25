const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env

const app = express();

// Middlewares (Herramientas para procesar datos)
app.use(cors()); // Permite que el Frontend se conecte con el Backend
app.use(express.json()); // Permite a la app entender datos enviados en formato JSON
app.use('/api/auth', require('./routes/authRoutes'));

// Ruta de prueba (Health Check)
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Servidor backend funcionando correctamente!' });
});

// Conexión a la base de datos MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conexión a MongoDB exitosa'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

