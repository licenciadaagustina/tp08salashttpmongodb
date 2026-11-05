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

// Actualizar completamente una reserva (PUT)
async function actualizarReservaPut(id, datosActualizados) {
    return await Reserva.findByIdAndUpdate(
        id,
        datosActualizados,
        { new: true, runValidators: true, upsert: false }
    );
}

// Actualizar parcialmente una reserva (PATCH)
async function actualizarReservaPatch(id, datosParciales) {
    return await Reserva.findByIdAndUpdate(
        id,
        { $set: datosParciales },
        { new: true, runValidators: true, upsert: false }
    );
}

// Eliminar una reserva físicamente por ID (DELETE)
async function eliminarReserva(id) {
    return await Reserva.findByIdAndDelete(id);
}

// ¡Exportamos todas juntas al final del archivo!
module.exports = {
    obtenerReservas,
    obtenerReservasPorSala,
    obtenerReservaPorId,
    crearReserva,
    contarReservas,
    actualizarReservaPut,
    actualizarReservaPatch,
    eliminarReserva
};