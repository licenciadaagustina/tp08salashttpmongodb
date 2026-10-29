const ReservaService = require('../services/reserva.service');

module.exports = {
    // --- MÉTODOS PARA EL SITIO HTML ---
    mostrarFormulario: (req, res) => {
        try {
            res.render('index.ejs', { error: null });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Error en el servidor");
        }
    },

    crearReserva: async (req, res) => {
        try {
            const { estudiante, email, sala, fecha, turno, personas } = req.body;
            await ReservaService.crearReserva({ estudiante, email, sala, fecha, turno, personas });
            res.redirect('/estado');
        } catch (error) {
            console.error("Error:", error);
            res.render('index.ejs', { error: "No se pudo registrar" });
        }
    },

    verEstado: async (req, res) => {
        try {
            const reservas = await ReservaService.obtenerReservas();
            res.render('estado.ejs', { reservas });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Error en el servidor");
        }
    },

    // --- MÉTODOS PARA LA API JSON (TP 08) ---
    listarReservasApi: async (req, res, next) => {
        try {
            const { sala } = req.query;
            
            // Validar si el parámetro sala viene repetido como arreglo
            if (Array.isArray(sala)) {
                return res.status(400).json({ error: "Parámetro sala repetido" });
            }

            let reservas;
            if (sala) {
                // Filtro exacto por sala textual según la consigna
                reservas = await ReservaService.obtenerReservasPorSala(sala);
            } else {
                reservas = await ReservaService.obtenerReservas();
            }

            // Mapear los documentos para exponer el id textual derivado del ObjectId
            const resultado = reservas.map(r => ({
                id: r._id.toString(),
                estudiante: r.estudiante,
                email: r.email,
                sala: r.sala,
                fecha: r.fecha,
                turno: r.turno,
                personas: r.personas,
                estado: r.estado
            }));

            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    },

    crearReservaApi: async (req, res, next) => {
        try {
            // Copiar explícitamente solo los 6 campos admitidos (rechazando req.body completo o campos extra como estado/id)
            const { estudiante, email, sala, fecha, turno, personas } = req.body;

            const nuevaReserva = await ReservaService.crearReserva({
                estudiante,
                email,
                sala,
                fecha,
                turno,
                personas,
                estado: 'pendiente' // Default exigido
            });

            const idStr = nuevaReserva._id.toString();

            // Configurar cabecera Location y responder 201
            res.setHeader('Location', `/api/reservas/${idStr}`);
            res.status(201).json({
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
            next(error);
        }
    },

    obtenerReservaPorIdApi: async (req, res, next) => {
        try {
            const { id } = req.params;

            // Validar formato básico de ObjectId de Mongoose (24 caracteres hexadecimales)
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: "ID mal formado" });
            }

            const reserva = await ReservaService.obtenerReservaPorId(id);

            if (!reserva) {
                return res.status(404).json({ error: "Recurso no encontrado" });
            }

            res.status(200).json({
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
    }
};