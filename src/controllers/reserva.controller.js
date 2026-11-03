const Reserva = require('../models/reserva.model'); // Asegurate de apuntar a tu modelo

// Listar todas las reservas (GET /api/reservas)
const listarReservasApi = async (req, res) => {
    try {
        const reservas = await Reserva.find();
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ error: "Fallo inesperado al listar reservas" });
    }
};

// Obtener una reserva por ID (GET /api/reservas/:id)
const obtenerReservaPorIdApi = async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findById(id);
        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }
        res.status(200).json(reserva);
    } catch (error) {
        res.status(400).json({ error: "ID inválido o error en la consulta" });
    }
};

// Crear una reserva (POST /api/reservas)
const crearReservaApi = async (req, res) => {
    try {
        // El POST no acepta que el cliente asigne estado ni _id
        const { estudiante, email, sala, fecha, turno, personas } = req.body;
        
        const nuevaReserva = new Reserva({
            estudiante,
            email,
            sala,
            fecha,
            turno,
            personas,
            estado: 'pendiente' // por defecto pendiente
        });

        const reservaGuardada = await nuevaReserva.save();
        
        // Devolver 201, recurso y Location header
        res.status(201)
           .header('Location', `/api/reservas/${reservaGuardada._id}`)
           .json(reservaGuardada);
    } catch (error) {
        res.status(400).json({ error: "Datos de entrada inválidos para la creación" });
    }
};

// Reemplazo completo (PUT /api/reservas/:id)
const reemplazarReservaApi = async (req, res) => {
    try {
        const { id } = req.params;
        const { estudiante, email, sala, fecha, turno, personas, estado } = req.body;

        // PUT exige los 7 campos editables
        if (!estudiante || !email || !sala || !fecha || !turno || personas === undefined || !estado) {
            return res.status(400).json({ error: "Faltan campos obligatorios para el reemplazo completo (se exigen los 7)" });
        }

        // Ejecutar reemplazo con runValidators: true y upsert: false
        const reservaActualizada = await Reserva.findByIdAndUpdate(
            id,
            { estudiante, email, sala, fecha, turno, personas, estado },
            { new: true, runValidators: true, upsert: false }
        );

        if (!reservaActualizada) {
            return res.status(404).json({ error: "ID válido pero ausente al intentar modificar" });
        }

        res.status(200).json(reservaActualizada);
    } catch (error) {
        res.status(400).json({ error: "Entrada inválida o error en el reemplazo" });
    }
};

// Actualización parcial (PATCH /api/reservas/:id)
const actualizarParcialReservaApi = async (req, res) => {
    try {
        const { id } = req.params;
        const camposPermitidos = {};

        // PATCH admite solo personas y estado, con al menos uno presente
        if (req.body.personas !== undefined) {
            camposPermitidos.personas = req.body.personas;
        }
        if (req.body.estado !== undefined) {
            camposPermitidos.estado = req.body.estado;
        }

        if (Object.keys(camposPermitidos).length === 0) {
            return res.status(400).json({ error: "Se debe proporcionar al menos 'personas' o 'estado' para actualizar" });
        }

        // Nunca pasar req.body completo, usar el objeto con los campos permitidos y $set
        const reservaActualizada = await Reserva.findByIdAndUpdate(
            id,
            { $set: camposPermitidos },
            { new: true, runValidators: true, upsert: false }
        );

        if (!reservaActualizada) {
            return res.status(404).json({ error: "ID válido pero ausente al intentar modificar" });
        }

        res.status(200).json(reservaActualizada);
    } catch (error) {
        res.status(400).json({ error: "Actualización parcial inválida" });
    }
};

// Eliminación física (DELETE /api/reservas/:id)
const eliminarReservaApi = async (req, res) => {
    try {
        const { id } = req.params;
        const reservaEliminada = await Reserva.findByIdAndDelete(id);

        if (!reservaEliminada) {
            return res.status(404).json({ error: "Recurso no encontrado para eliminar" });
        }

        // 204 sin cuerpo si eliminó correctamente
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: "ID mal formado o error al eliminar" });
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