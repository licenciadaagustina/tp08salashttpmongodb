const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// Definición de las rutas de la API asociadas al controlador
router.get('/', reservaController.listarReservasApi);
router.post('/', reservaController.crearReservaApi);
router.get('/:id', reservaController.obtenerReservaPorIdApi);

module.exports = router;