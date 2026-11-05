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

// Procesar la creación de una reserva desde la web (POST) con Allowlist estricta
const crearReservaWeb = async (req, res) => {
    try {
        // Extraer únicamente los 6 campos permitidos (evita que el usuario inyecte _id o estado)
        const { estudiante, email, sala, fecha, turno, personas } = req.body;

        // Validación estricta del tipo de dato en personas (número entero entre 1 y 6)
        const numPersonas = Number(personas);
        if (!Number.isInteger(numPersonas) || numPersonas < 1 || numPersonas > 6) {
            return res.status(400).send("El campo 'personas' debe ser un número entero entre 1 y 6.");
        }

        // Enviar un objeto limpio y controlado al servicio con el estado por defecto
        await reservaService.crearReserva({
            estudiante,
            email,
            sala,
            fecha,
            turno,
            personas: numPersonas,
            estado: 'pendiente'
        });

        res.redirect('/');
    } catch (error) {
        res.status(400).send("Error al crear la reserva: " + error.message);
    }
};

// Mostrar la ruta /estado con el conteo total (pasando también una estructura compatible para la vista)
const mostrarEstadoWeb = async (req, res) => {
    try {
        const total = await reservaService.contarReservas();
        // Si la vista 'estado' espera 'reservas' o 'total', le pasamos ambos para evitar incompatibilidades
        const reservas = await reservaService.obtenerReservas();
        res.render('estado', { total, reservas });
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