const mongoose = require('mongoose');

const asistenteSocialSchema = new mongoose.Schema({
    Rut: String,
    pass: String,
    nombre: String,
    apellido: String,
    email: String,
    cargo: String,
    estado: String,

});

module.exports = mongoose.model('AsistenteSocial',asistenteSocialSchema); //Modulo