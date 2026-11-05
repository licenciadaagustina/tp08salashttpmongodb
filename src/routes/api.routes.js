const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// --- RUTAS DEL TP 08 ---
router.get('/', reservaController.listarApi);
router.post('/', reservaController.crearApi);
router.get('/:id', reservaController.obtenerPorIdApi);

// --- RUTAS DEL TP 09 (PUT, PATCH, DELETE) ---
// Nota: Como la ruta base ya es /api/reservas, aquí solo ponemos /:id
router.put('/:id', reservaController.actualizarReservaPutApi);
router.patch('/:id', reservaController.actualizarReservaPatchApi);
router.delete('/:id', reservaController.eliminarReservaApi);

module.exports = router;