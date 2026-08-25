const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar Usuario (Para poblar la base de datos o desde un panel Admin)
exports.registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    let usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ mensaje: 'El usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      nombre,
      email,
      password: passwordHash,
      rol: rol || 'solicitante'
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
};

// Login de Usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(400).json({ mensaje: 'Credenciales inválidas' });

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) return res.status(400).json({ mensaje: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login', error: error.message });
  }
};

// Obtener lista de usuarios con rol técnico (para asignación)
exports.obtenerTecnicos = async (req, res) => {
  try {
    const tecnicos = await User.find({ rol: 'tecnico' }).select('nombre email');
    res.json(tecnicos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener técnicos', error: error.message });
  }
};