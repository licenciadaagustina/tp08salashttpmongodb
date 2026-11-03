const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');

// Definición de las rutas de la API asociadas al controlador
router.get('/', reservaController.listarReservasApi);
router.post('/', reservaController.crearReservaApi);
router.get('/:id', reservaController.obtenerReservaPorIdApi);

// 👉 Agregá estas rutas nuevas para completar el CRUD del TP 09:
router.put('/:id', reservaController.reemplazarReservaApi);       // PUT: Reemplazo completo (exige los 7 campos)
router.patch('/:id', reservaController.actualizarParcialReservaApi); // PATCH: Cambio parcial (personas o estado)
router.delete('/:id', reservaController.eliminarReservaApi);    // DELETE: Eliminación física (devuelve 204)

module.exports = router;