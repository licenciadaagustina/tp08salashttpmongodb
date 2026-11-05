const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// Ruta principal: Listado web de reservas
router.get('/', reservaController.listarWeb);

// Ruta para procesar el formulario de creación (con redirección 302 o error 400)
router.post('/reservas', reservaController.crearWeb);

// Ruta de estado con el conteo real de MongoDB
router.get('/estado', reservaController.verEstadoWeb);

module.exports = router;