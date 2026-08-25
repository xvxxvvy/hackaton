const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.crearTicket);       // POST /api/tickets
router.get('/', ticketController.obtenerTickets);      // GET /api/tickets
router.put('/:id', ticketController.actualizarTicket); // PUT /api/tickets/:id

module.exports = router;