const express = require('express');
const router = express.Router();
const { renderInicio, crearWeb, renderEstado } = require('../controllers/reserva.web.controller');

// Rutas Web
router.get('/', renderInicio);
router.post('/', crearWeb);
router.get('/estado', renderEstado);

module.exports = router;