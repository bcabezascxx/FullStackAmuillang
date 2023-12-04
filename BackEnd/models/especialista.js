const mongoose = require('mongoose');

const especialistaSchema = new mongoose.Schema({
    Rut: {
        type:String,
        unique: true
    },
    pass: String,
    nombre: String,
    apellido: String,
    email: String, 
    cargo: String,
    estado: String,
    asistencia: [{
        fecha: {
            type:Date,
            required: true
        },
        presente:{
            type:Boolean,
            default:true
        }
    }],
    horarios: [{
        fecha: {
            type:Date,
            required:true
        },
        hora: {
            type:String, 
            required: true
        }

    }]
});

module.exports = mongoose.model('Especialista',especialistaSchema); //Modulo