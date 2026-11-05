const reservaService = require('../services/reserva.service');

// Mostrar la vista principal con el listado de reservas
const listarReservasWeb = async (req, res) => {
    try {
        const reservas = await reservaService.obtenerReservas();
        res.render('index', { reservas });
    } catch (error) {
        res.status(500).send("Error al cargar las vistas de reservas");
    }
};

// Ver el detalle individual de una reserva en el navegador
const obtenerDetalleWeb = async (req, res) => {
    try {
        const reserva = await reservaService.obtenerReservaPorId(req.params.id);
        if (!reserva) {
            return res.status(404).send("Reserva no encontrada");
        }
        res.render('detalle', { reserva });
    } catch (error) {
        res.status(500).send("Error al obtener el detalle de la reserva");
    }
};

// Mostrar el formulario de creación
const mostrarFormularioWeb = (req, res) => {
    res.render('crear');
};

// Procesar la creación de una reserva desde la web (POST)
const crearReservaWeb = async (req, res) => {
    try {
        await reservaService.crearReserva(req.body);
        res.redirect('/');
    } catch (error) {
        res.status(400).send("Error al crear la reserva: " + error.message);
    }
};

// Mostrar la ruta /estado con el conteo total
const mostrarEstadoWeb = async (req, res) => {
    try {
        const total = await reservaService.contarReservas();
        res.render('estado', { total });
    } catch (error) {
        res.status(500).send("Error al obtener el estado del sistema");
    }
};

module.exports = {
    listarReservasWeb,
    obtenerDetalleWeb,
    mostrarFormularioWeb,
    crearReservaWeb,
    mostrarEstadoWeb
};