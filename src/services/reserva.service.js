const Reserva = require('../models/reserva.model');

// Obtener todas las reservas
async function obtenerReservas() {
    return await Reserva.find();
}

// Obtener reservas filtradas por sala exacta
async function obtenerReservasPorSala(sala) {
    return await Reserva.find({ sala });
}

// Buscar una reserva específica por su ID de MongoDB
async function obtenerReservaPorId(id) {
    return await Reserva.findById(id);
}

// Crear y persistir una nueva reserva en la base de datos
async function crearReserva(datosReserva) {
    return await Reserva.create(datosReserva);
}

// Obtener el conteo total de reservas (utilizado por la ruta /estado del sitio web)
async function contarReservas() {
    return await Reserva.countDocuments();
}

module.exports = {
    obtenerReservas,
    obtenerReservasPorSala,
    obtenerReservaPorId,
    crearReserva,
    contarReservas
};