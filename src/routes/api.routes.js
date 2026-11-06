const express = require('express');
const router = express.Router();
const reservaApiController = require('../controllers/reserva.controller');

// Rutas de la API (montadas bajo /api/reservas en app.js)

// 1. Obtener todas las reservas (soporta filtro opcional ?sala=...)
router.get('/', reservaApiController.obtenerTodas);

// 2. Crear una nueva reserva (devuelve 201 y cabecera Location)
router.post('/', reservaApiController.crear);

// 3. Obtener el detalle de una reserva por su ID textual
router.get('/:id', reservaApiController.obtenerPorId);

module.exports = router;