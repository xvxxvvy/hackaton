const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Asegúrate de que apunte a src/models/User
require('dotenv').config();

const usuariosIniciales = [
  {
    nombre: 'Juan Solicitante',
    email: 'solicitante@test.com',
    password: 'password123',
    rol: 'solicitante'
  },
  {
    nombre: 'Pedro Técnico',
    email: 'tecnico@test.com',
    password: 'password123',
    rol: 'tecnico'
  },
  {
    nombre: 'Ana Admin',
    email: 'admin@test.com',
    password: 'password123',
    rol: 'admin'
  }
];

const sembrarBaseDeDatos = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mantenimiento_db';
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB...');

    // Limpiar usuarios previos
    await User.deleteMany({});

    for (const u of usuariosIniciales) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.password, salt);

      await User.create({
        nombre: u.nombre,
        email: u.email,
        password: passwordHash,
        rol: u.rol
      });
    }

    console.log('✅ Usuarios de prueba creados exitosamente');
    process.exit();
  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
    process.exit(1);
  }
};

sembrarBaseDeDatos();