const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema(
  {
    estudiante: {
      type: String,
      required: [true, 'El nombre del estudiante es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      trim: true,
      validate: {
        validator: function (v) {
          return typeof v === 'string' && v.includes('@');
        },
        message: 'El email debe contener un @'
      }
    },
    sala: {
      type: String,
      required: [true, 'La sala es obligatoria'],
      enum: {
        values: ['Sala Norte', 'Sala Sur', 'Sala Multimedia'],
        message: 'Sala no permitida'
      }
    },
    fecha: {
      type: String,
      required: [true, 'La fecha es obligatoria'],
      trim: true
    },
    turno: {
      type: String,
      required: [true, 'El turno es obligatorio'],
      enum: {
        values: ['Mañana', 'Tarde', 'Noche'],
        message: 'Turno no permitido'
      }
    },
    personas: {
      type: Number,
      required: [true, 'El número de personas es obligatorio'],
      validate: {
        validator: Number.isInteger,
        message: 'El número de personas debe ser un número entero'
      },
      min: [1, 'La cantidad de personas debe ser al menos 1'],
      max: [6, 'La cantidad de personas no puede superar 6']
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada'],
      default: 'pendiente'
    }
  },
  {
    timestamps: true
  }
);

// Transforma la salida JSON para exponer un id textual y remover _id / __v
reservaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Reserva', reservaSchema);