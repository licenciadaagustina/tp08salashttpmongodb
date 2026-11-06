const mongoose = require('mongoose');
const reservaService = require('../services/reserva.service');

const listarReservasApi = async (req, res, next) => {
  try {
    const salaQuery = req.query.sala;
    let filtroSala = null;

    if (salaQuery !== undefined) {
      if (Array.isArray(salaQuery)) {
        return res.status(400).json({ error: 'El parámetro sala no puede estar repetido' });
      }
      if (typeof salaQuery !== 'string') {
        return res.status(400).json({ error: 'Formato de sala inválido' });
      }
      filtroSala = salaQuery.trim();
    }

    const reservas = await reservaService.listarReservas(filtroSala);
    return res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
};

const obtenerReservaPorIdApi = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID mal formado' });
    }

    const reserva = await reservaService.obtenerReservaPorId(id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    return res.status(200).json(reserva);
  } catch (error) {
    next(error);
  }
};

const crearReservaApi = async (req, res, next) => {
  try {
    const nuevaReserva = await reservaService.crearReserva(req.body);
    
    const locationUrl = `${req.protocol}://${req.get('host')}/api/reservas/${nuevaReserva.id}`;
    res.setHeader('Location', locationUrl);

    return res.status(201).json(nuevaReserva);
  } catch (error) {
    if (error.status === 400 || error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// Funciones adicionales por si tus rutas las usan (PUT, PATCH, DELETE)
const reemplazarReservaApi = async (req, res, next) => {
  try {
    // Lógica o stub si tu profesor lo exige
    return res.status(501).json({ error: 'No implementado' });
  } catch (error) {
    next(error);
  }
};

const actualizarParcialReservaApi = async (req, res, next) => {
  try {
    return res.status(501).json({ error: 'No implementado' });
  } catch (error) {
    next(error);
  }
};

const eliminarReservaApi = async (req, res, next) => {
  try {
    return res.status(501).json({ error: 'No implementado' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarReservasApi,
  obtenerReservaPorIdApi,
  crearReservaApi,
  reemplazarReservaApi,
  actualizarParcialReservaApi,
  eliminarReservaApi
};
