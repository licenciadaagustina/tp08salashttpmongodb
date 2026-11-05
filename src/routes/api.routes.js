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

// 👉 Agregá estas rutas nuevas para completar el CRUD del TP 09:
router.put('/:id', reservaController.reemplazarReservaApi);       // PUT: Reemplazo completo (exige los 7 campos)
router.patch('/:id', reservaController.actualizarParcialReservaApi); // PATCH: Cambio parcial (personas o estado)
router.delete('/:id', reservaController.eliminarReservaApi);    // DELETE: Eliminación física (devuelve 204)

module.exports = router;