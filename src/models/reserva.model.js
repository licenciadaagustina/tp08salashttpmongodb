const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    estudiante: {
        type: String,
        required: [true, "El campo estudiante es obligatorio"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "El campo email es obligatorio"],
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "El email debe contener un formato válido con '@'"]
    },
    sala: {
        type: String,
        required: [true, "La sala es obligatoria"],
        enum: ["Sala Norte", "Sala Sur", "Sala Multimedia"]
    },
    fecha: {
        type: String,
        required: [true, "La fecha es obligatoria"],
        trim: true
    },
    turno: {
        type: String,
        required: [true, "El turno es obligatorio"],
        enum: ["Mañana", "Tarde", "Noche"]
    },
    personas: {
        type: Number,
        required: [true, "El número de personas es obligatorio"],
        min: [1, "Mínimo 1 persona"],
        max: [6, "Máximo 6 personas"],
        validate: {
            validator: Number.isInteger,
            message: "La cantidad de personas debe ser un número entero"
        }
    },
    estado: {
        type: String,
        enum: ["pendiente", "confirmada"],
        default: "pendiente"
    }
});

module.exports = mongoose.model('Reserva', reservaSchema);