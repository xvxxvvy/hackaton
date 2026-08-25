const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['solicitante', 'tecnico', 'admin'],
    default: 'solicitante'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);