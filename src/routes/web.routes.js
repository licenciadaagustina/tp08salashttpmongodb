const express = require('express');
const router = express.Router();
const reservaWebController = require('../controllers/reserva.web.controller');

// Ruta principal / inicio (listado HTML de reservas)
router.get('/', reservaWebController.listarReservasWeb);

// Ruta para recibir el envío del formulario HTML (POST /reservas)
router.post('/reservas', reservaWebController.crearReservaWeb);

// Ruta para ver el detalle individual de una reserva en el navegador
router.get('/reservas/:id', reservaWebController.obtenerDetalleWeb);

// Ruta para mostrar el formulario de creación (si se accede por GET) y mantener /crear
router.get('/crear', reservaWebController.mostrarFormularioWeb);
router.post('/crear', reservaWebController.crearReservaWeb);

// Ruta /estado que muestra la cantidad real de documentos en MongoDB
router.get('/estado', reservaWebController.mostrarEstadoWeb);

module.exports = router;