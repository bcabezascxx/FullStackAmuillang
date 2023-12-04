const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    Rut: String,
    edad: Number,
    nombre: String,
    sexo: String,
    apellido: String,
    telefono: Number,
    email: String,
    Direccion: String,
    FechaNacimiento:String,
    tieneFichaMedica: Boolean



});

module.exports = mongoose.model('Paciente',pacienteSchema); //Modulo