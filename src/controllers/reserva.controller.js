const ReservaService = require('../services/reserva.service');

const reservaController = {
    // ==========================================
    // MÉTODOS DEL TP 08 (API y Vistas Web)
    // ==========================================

    // Listar en API (GET /api/reservas) y con filtro de sala exacto
    listarApi: async (req, res, next) => {
        try {
            const { sala } = req.query;
            let filtro = {};

            if (sala !== undefined) {
                // Si viene como array (parámetro repetido ?sala=X&sala=Y), rechazar con 400[cite: 2, 3]
                if (Array.isArray(sala)) {
                    return res.status(400).json({ error: "Parámetro de sala repetido o inválido" });
                }
                // Filtro de igualdad exacta por texto[cite: 2, 3]
                filtro.sala = sala;
            }

            const reservas = await ReservaService.obtenerReservas(filtro);
            return res.status(200).json(reservas);
        } catch (error) {
            next(error);
        }
    },

    // Obtener por ID en API (GET /api/reservas/:id)[cite: 2, 3]
    obtenerPorIdApi: async (req, res, next) => {
        try {
            const { id } = req.params;

            // Validar formato de ObjectId de 24 caracteres hex
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: "ID mal formado" });
            }

            const reserva = await ReservaService.obtenerReservaPorId(id);
            if (!reserva) {
                return res.status(404).json({ error: "Recurso no encontrado" });
            }

            // Mapear respuesta asegurando ID textual[cite: 2]
            return res.status(200).json({
                id: reserva._id.toString(),
                estudiante: reserva.estudiante,
                email: reserva.email,
                sala: reserva.sala,
                fecha: reserva.fecha,
                turno: reserva.turno,
                personas: reserva.personas,
                estado: reserva.estado
            });
        } catch (error) {
            next(error);
        }
    },

    // Crear reserva por API (POST /api/reservas)[cite: 2, 3, 4]
    crearApi: async (req, res, next) => {
        try {
            if (!req.body || typeof req.body !== "object" || Array.isArray(req.body) || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: "Cuerpo ausente o JSON mal formado" });
            }

            // Copiar explícitamente solo los seis campos admitidos (ignora estado o _id extra)[cite: 2, 4]
            const { estudiante, email, sala, fecha, turno, personas } = req.body;

            // Validaciones defensivas de tipo antes de enviar a Mongoose
            if (typeof personas !== 'number' || !Number.isInteger(personas) || personas < 1 || personas > 6) {
                return res.status(400).json({ error: "El campo personas debe ser un número entero entre 1 y 6" });
            }

            const nuevaReserva = await ReservaService.crearReserva({
                estudiante,
                email,
                sala,
                fecha,
                turno,
                personas
            });

            const idStr = nuevaReserva._id.toString();
            res.setHeader('Location', `/api/reservas/${idStr}`); // Cabecera Location requerida[cite: 2, 3, 4]

            return res.status(201).json({
                id: idStr,
                estudiante: nuevaReserva.estudiante,
                email: nuevaReserva.email,
                sala: nuevaReserva.sala,
                fecha: nuevaReserva.fecha,
                turno: nuevaReserva.turno,
                personas: nuevaReserva.personas,
                estado: nuevaReserva.estado
            });
        } catch (error) {
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: error.message });
            }
            next(error);
        }
    },

    // Vistas Web: Listado (GET /)[cite: 1, 4]
    listarWeb: async (req, res, next) => {
        try {
            const reservas = await ReservaService.obtenerReservas();
            res.render('index', { reservas, error: null, valores: {} });
        } catch (error) {
            next(error);
        }
    },

    // Vistas Web: Crear con redirección 302 o error 400 conservando valores[cite: 1, 4]
    crearWeb: async (req, res, next) => {
        try {
            const { estudiante, email, sala, fecha, turno, personas } = req.body;
            const personasNum = Number(personas);

            if (!estudiante || !email || !sala || !fecha || !turno || isNaN(personasNum)) {
                const reservas = await ReservaService.obtenerReservas();
                return res.status(400).render('index', {
                    reservas,
                    error: "Todos los campos son obligatorios y personas debe ser numérico.",
                    valores: req.body
                });
            }

            await ReservaService.crearReserva({
                estudiante,
                email,
                sala,
                fecha,
                turno,
                personas: personasNum
            });

            return res.redirect(302, '/');
        } catch (error) {
            try {
                const reservas = await ReservaService.obtenerReservas();
                return res.status(400).render('index', {
                    reservas,
                    error: error.message,
                    valores: req.body
                });
            } catch (innerErr) {
                next(innerErr);
            }
        }
    },

    // Vista Estado con conteo real desde MongoDB (GET /estado)[cite: 1, 4]
    verEstadoWeb: async (req, res, next) => {
        try {
            const conteo = await ReservaService.contarReservas();
            res.render('estado', { conteo });
        } catch (error) {
            next(error);
        }
    },

    // ==========================================
    // MÉTODOS DEL TP 09 (PUT, PATCH, DELETE)
    // ==========================================

    actualizarReservaPutApi: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: "ID mal formado" });
            }

            const bodyKeys = Object.keys(req.body);
            const camposPermitidos = ["estudiante", "email", "sala", "fecha", "turno", "personas", "estado"];

            if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
                return res.status(400).json({ error: "Cuerpo inválido o ausente." });
            }

            const tieneCamposInvalidos = bodyKeys.some(
                key => !camposPermitidos.includes(key) || key.startsWith("$") || key === "_id"
            );
            if (tieneCamposInvalidos || bodyKeys.length !== camposPermitidos.length) {
                return res.status(400).json({ error: "Faltan campos obligatorios o hay campos no permitidos para PUT." });
            }

            const reservaActualizada = await ReservaService.actualizarReservaPut(id, req.body);

            if (!reservaActualizada) {
                return res.status(404).json({ error: "Recurso no encontrado" });
            }

            res.status(200).json({
                id: reservaActualizada._id.toString(),
                estudiante: reservaActualizada.estudiante,
                email: reservaActualizada.email,
                sala: reservaActualizada.sala,
                fecha: reservaActualizada.fecha,
                turno: reservaActualizada.turno,
                personas: reservaActualizada.personas,
                estado: reservaActualizada.estado
            });
        } catch (error) {
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: error.message });
            }
            next(error);
        }
    },

    actualizarReservaPatchApi: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: "ID mal formado" });
            }

            const bodyKeys = Object.keys(req.body);
            const camposPatch = ["personas", "estado"];

            if (!req.body || typeof req.body !== "object" || Array.isArray(req.body) || bodyKeys.length === 0) {
                return res.status(400).json({ error: "Cuerpo ausente o inválido para PATCH." });
            }

            const tieneCamposInvalidos = bodyKeys.some(
                key => !camposPatch.includes(key) || key.startsWith("$") || key === "_id"
            );
            if (tieneCamposInvalidos) {
                return res.status(400).json({ error: "Campos no permitidos en PATCH." });
            }

            const updates = {};
            if (req.body.personas !== undefined) updates.personas = req.body.personas;
            if (req.body.estado !== undefined) updates.estado = req.body.estado;

            const reservaActualizada = await ReservaService.actualizarReservaPatch(id, updates);

            if (!reservaActualizada) {
                return res.status(404).json({ error: "Recurso no encontrado" });
            }

            res.status(200).json({
                id: reservaActualizada._id.toString(),
                estudiante: reservaActualizada.estudiante,
                email: reservaActualizada.email,
                sala: reservaActualizada.sala,
                fecha: reservaActualizada.fecha,
                turno: reservaActualizada.turno,
                personas: reservaActualizada.personas,
                estado: reservaActualizada.estado
            });
        } catch (error) {
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: error.message });
            }
            next(error);
        }
    },

    eliminarReservaApi: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: "ID mal formado" });
            }

            const reservaEliminada = await ReservaService.eliminarReserva(id);

            if (!reservaEliminada) {
                return res.status(404).json({ error: "Recurso no encontrado" });
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

module.exports = reservaController;