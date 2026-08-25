const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// RUTAS DE LA API (Asegúrate de que estas dos líneas existan)
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Ruta de prueba
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Servidor backend funcionando correctamente!' });
});

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mantenimiento_db';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conexión a MongoDB exitosa'))
  .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});