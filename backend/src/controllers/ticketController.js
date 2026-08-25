const Ticket = require('../models/Ticket');

// Crear una nueva solicitud / ticket
exports.crearTicket = async (req, res) => {
  try {
    const { titulo, descripcion, areaTrabajo, criticidad, solicitante } = req.body;

    const nuevoTicket = new Ticket({
      titulo,
      descripcion,
      areaTrabajo,
      criticidad,
      solicitante
    });

    await nuevoTicket.save();
    res.status(201).json({ mensaje: 'Solicitud creada con éxito', ticket: nuevoTicket });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la solicitud', error: error.message });
  }
};

// Obtener la lista de todas las solicitudes
exports.obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('solicitante', 'nombre email rol')
      .populate('tecnicoAsignado', 'nombre email');
    
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener solicitudes', error: error.message });
  }
};

// Actualizar estado o asignar técnico
exports.actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, tecnicoAsignado, criticidad } = req.body;

    const ticketActualizado = await Ticket.findByIdAndUpdate(
      id,
      { estado, tecnicoAsignado, criticidad },
      { new: true }
    );

    if (!ticketActualizado) {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    }

    res.status(200).json({ mensaje: 'Solicitud actualizada', ticket: ticketActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la solicitud', error: error.message });
  }
};