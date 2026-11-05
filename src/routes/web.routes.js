const express = require('express');
const router = express.Router();
const reservaWebController = require('../controllers/reserva.web.controller'); // Ajustá la ruta si usás otro nombre

// Ruta principal / inicio (listado HTML de reservas)
router.get('/', reservaWebController.listarReservasWeb);

// Ruta para ver el detalle individual de una reserva en el navegador
router.get('/reservas/:id', reservaWebController.obtenerDetalleWeb);

// Ruta para mostrar el formulario de creación / procesar el alta (POST)
router.get('/crear', reservaWebController.mostrarFormularioWeb);
router.post('/crear', reservaWebController.crearReservaWeb);

// Ruta /estado que muestra la cantidad real de documentos en MongoDB
router.get('/estado', reservaWebController.mostrarEstadoWeb);

module.exports = router;