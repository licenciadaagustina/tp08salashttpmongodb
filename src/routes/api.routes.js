const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// --- RUTAS DEL CRUD DE RESERVAS ---
router.get('/', reservaController.listarReservasApi);                  // GET: Listar todas
router.get('/:id', reservaController.obtenerReservaPorIdApi);          // GET: Obtener por ID
router.post('/', reservaController.crearReservaApi);                   // POST: Crear reserva
router.put('/:id', reservaController.reemplazarReservaApi);          // PUT: Reemplazo completo (exige los 7 campos)
router.patch('/:id', reservaController.actualizarParcialReservaApi); // PATCH: Cambio parcial (personas o estado)
router.delete('/:id', reservaController.eliminarReservaApi);         // DELETE: Eliminación física (devuelve 204)

module.exports = router;