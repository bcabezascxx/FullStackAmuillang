const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();



const {ApolloServer, gql} = require('apollo-server-express');


const {merge} = require('lodash');
const { ObjectId } = require('mongodb');
const { Types } = require('mongoose');



const Especialista = require('./models/especialista'); 
const Secretaria = require('./models/secretaria');
const Paciente = require('./models/paciente');
const AsistenteSocial = require('./models/asistenteSocial');
const Directora = require('./models/directora');
const FichaMedica = require('./models/fichaMedica');
const Cita = require('./models/cita');
const especialista = require('./models/especialista');

const { DateTime } = require('luxon'); // Asegúrate de tener instalada la librería 'luxon'



//mongoose.connect('mongodb+srv://amuillangcorreo:admin123@cluster0.nuht1cf.mongodb.net/Amuillang',{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.MONGODB_CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true }); //se hace la conexión cifrada al deploy


const typeDefs= gql`

type Directora{
    id: ID!
    Rut: String!
    pass: String!
    nombre: String!
    apellido: String!
    email: String!
    cargo: String!
}

type Asistencia{
    fecha: String!
    presente: Boolean!
}

type Horario{
    fecha: String!
    hora:String!
}

 type Especialista{
    id: ID!
    Rut: String!
    pass: String!
    nombre: String!
    apellido:String!
    email: String!
    cargo: String!
    estado: String!
    asistencia: [Asistencia!]
    horarios: [Horario!]
 }

 type Secretaria{
    id: ID!
    Rut: String!
    pass: String!
    nombre: String!
    apellido: String!
    email: String!
    cargo: String!
    estado: String!
 }

 type AsistenteSocial{
    id: ID!
    Rut: String!
    pass: String!
    nombre: String!
    apellido: String!
    email: String!
    cargo: String!
    estado: String!
 }

 type Paciente{
    id: ID!
    Rut: String!
    edad: Int!
    nombre: String!
    sexo: String!
    apellido: String!
    telefono: Int!
    email: String!
    Direccion: String!
    FechaNacimiento:String!
    tieneFichaMedica: Boolean
 }

 type Alert{
    message: String
 }

 type LoginResponse{
    message: String!
    cargo: String!
    id: ID
 }

 type FichaMedica {
    id:ID
    Paciente: Paciente
    observaciones: [Observacion]
    historialMedico: [HistorialMedico]
    fechaCreacion: String
}


 type Observacion {
        id: ID!
        fecha: String
        especialista: Especialista
        diagnostico: String
        notas: String
        recomendaciones: String
        asistencia: Boolean
        justificacion: String
 }

 type HistorialMedico {
        diagnosticoAnterior: String
        EnfermedadAnterior: String
  }

  type Cita {
    id: ID!
    fecha: String!
    hora: String!
    especialista: Especialista!  
    paciente: Paciente!         
    disponibilidad:Boolean!
  }

 input DirectoraInput{
    Rut: String!
    pass: String!
    nombre: String!
    apellido: String!
    email: String!
    cargo: String!
 }

 input AsistenciaInput{
    fecha:String!
    presente:Boolean
 }
 input HorarioInput{
    fecha:String!
    hora:String!
 }
 input EspecialistaInput{
    Rut: String!
    pass: String!
    nombre: String!
    apellido:String!
    email: String!
    cargo: String!
    estado: String!
    asistencia: [AsistenciaInput!]
    horarios: [HorarioInput!]
 }

 input SecretariaInput{
    Rut: String!
    pass: String!
    nombre: String!
    apellido: String!
    email: String!
    cargo: String!
    estado: String!
 }

 input AsistenteSocialInput{
    Rut: String!
    pass: String!
    nombre: String!
    apellido: String!
    email:String!
    cargo: String!
    estado: String!
 }
 input ObservacionInput {
    fecha: String!
    especialistaId: ID
    diagnostico: String!
    notas: String
    recomendaciones: String
    asistencia: Boolean
    justificacion: String
 }

 input HistorialMedicoInput {
    diagnosticoAnterior: String
    EnfermedadAnterior: String
 }

 input FichaMedicaInput {
    PacienteId: ID
    observaciones: [ObservacionInput] 
    historialMedico: [HistorialMedicoInput]
 }

 input PacienteInput{
    Rut: String!
    edad: Int!
    nombre: String!
    sexo: String!
    apellido: String!
    telefono: Int!
    email: String!
    Direccion: String!
    FechaNacimiento:String!
    tieneFichaMedica: Boolean!
 }

 input ContactoPacienteInput {
    telefono: Int!
    email: String!
    Direccion: String!
 }

 input CitaInput {
    fecha: String
    hora: String
    especialistaId: ID
    pacienteId: ID
    disponibilidad: Boolean
  }

  

 type Query{
    getDirectoras: [Directora]
    getDirectora(id:ID!) : Directora

    getEspecialistas: [Especialista]
    getEspecialista(id: ID) : Especialista

    getSecretarias : [Secretaria]
    getSecretaria(id: ID!): Secretaria

    getAsistenteSociales: [AsistenteSocial]
    getAsistenteSocial(id:ID!) : AsistenteSocial

    buscarPacientePorRut(Rut: String!) : Paciente
    getPacientes : [Paciente]
    getPaciente(id: ID): Paciente
    obtenerPacientePorId(id:ID!) : Paciente
    tieneFichaMedica(id:ID!): Paciente

    obtenerFichaMedicaPorPaciente(PacienteId: ID!): FichaMedica
    getFichas : [FichaMedica]
    
    getCitas : [Cita]
    getCita(id: ID!) : Cita

    
    



 }

 type Mutation{
    addDirectora(input: DirectoraInput): Directora

    addEspecialista(input: EspecialistaInput): Especialista
    updateEspecialista(id: ID!, input:EspecialistaInput): Especialista
    deleteEspecialista(id: ID!) : Alert
    UpdateEspecialistaEstado(id: ID!, estado: String!) : Especialista
    UpdateEspecialistaPassword(id: ID!, pass:String) : Especialista
    UpdateEspecialistaEmail(id: ID!, email:String) : Especialista
    actualizarHorarios(id: ID!, horarios:[HorarioInput]) : Especialista
    updateEspecialistaHorarios(id: ID!, horarios: [HorarioInput]!): Especialista



    addSecretaria(input: SecretariaInput) : Secretaria
    updateSecretaria(id: ID!, input:SecretariaInput): Secretaria
    deleteSecretaria(id: ID!) : Alert
    UpdateSecretariaEstado(id: ID!, estado: String!) : Secretaria
    UpdateSecretariaPassword(id: ID!, pass:String) : Secretaria
    UpdateSecretariaEmail(id: ID!, email:String) : Secretaria

    updateContactoPaciente(id: ID!, input: ContactoPacienteInput): Paciente
    addPaciente(input: PacienteInput) : Paciente
    updatePaciente(id: ID!, input:PacienteInput): Paciente
    deletePaciente(id: ID!) : Alert


    addAsistenteSocial(input: AsistenteSocialInput) : AsistenteSocial
    updateAsistenteSocial(id: ID!, input:AsistenteSocialInput): AsistenteSocial
    deleteAsistenteSocial(id: ID!) : Alert
    UpdateAsistenteSocialEstado(id: ID!, estado: String!) : AsistenteSocial
    UpdateAsistenteSocialPassword(id: ID!, pass:String) : AsistenteSocial
    UpdateAsistenteSocialEmail(id: ID!, email:String) : AsistenteSocial

    iniciarSesion(Rut: String!, pass: String!): LoginResponse!

    crearFichaMedica(input: FichaMedicaInput!): FichaMedica
    agregarObservacion(pacienteId: ID!, input: ObservacionInput!): Observacion
    actualizarObservaciones(idObservacion:ID!, diagnostico:String!, notas: String!, recomendaciones: String!) : Observacion
    borrarObservacion(id:ID!) : Alert

    agendarCita(pacienteId: ID, especialistaId: ID, input: CitaInput): Cita
    updateCitaDisponibilidad(id:ID, disponibilidad: Boolean) : Cita
    cancelarCita(id: ID!): Alert!


    
 }
`;

const resolvers ={
    Query: {
        async getDirectoras(obj){
            const directora = await Directora.find();
            return directora;
        },
        async getDirectora(obj, {id}){
            const directora = await Directora.findById(id);
            return directora;
        },
        async getEspecialistas(obj){
            const especialista = await Especialista.find();
            return especialista;
        },
        async getEspecialista(obj, {id}){
            const especialista = await Especialista.findById(id);
            return especialista;
        },
        async getSecretarias(obj){
            const secretaria = await Secretaria.find();
            return secretaria;
        },
        async getSecretaria(obj, {id}){
            const secretaria = await Secretaria.findById(id);
            return secretaria;
        },
        async getPacientes(obj){
            const paciente = await Paciente.find();
            return paciente;
        },
        async getPaciente(obj, {id}){
            const paciente = await Paciente.findById(id);
            return paciente;
        },
        async getAsistenteSociales(obj){
            const asistenteSocial = await AsistenteSocial.find();
            return asistenteSocial;
        },
        async getAsistenteSocial(obj, {id}){
            const asistenteSocial = await AsistenteSocial.findById(id);
            return asistenteSocial;
        },
        buscarPacientePorRut: async (_, { Rut }) => {
            const paciente = await Paciente.findOne({ Rut });
            if (!paciente) {
                throw new Error("RUT no encontrado");
            }
            return paciente;
        },
        obtenerFichaMedicaPorPaciente: async (_, { PacienteId }) => {
            return await FichaMedica.findOne({ Paciente: PacienteId }).populate('Paciente').populate('observaciones.especialista');
        },
        obtenerPacientePorId: async (_, { id }) => {
            return await Paciente.findById(id);
        },
        async getCitas(obj){
            
            const citas= await Cita.find()
            // Filtrar citas que aún no han pasado
            /*const citasFiltradas = citas.filter((cita) => {
                const fechaCita = DateTime.fromISO(cita.fecha);
                const fechaActual = DateTime.now();

                // Retornar true si la fecha de la cita es después de la fecha actual
                return fechaCita > fechaActual;
            });

            return citasFiltradas;*/
            return citas
        },       
        async getCita(obj, {id}){
            const cita= await Cita.findById(id);
            return cita;
        },
        async tieneFichaMedica({ paciente }) {
            console.log("INGRESE")
            const fichaMedica = await FichaMedica.findOne({ Paciente: paciente.id });
            return fichaMedica !== null;
        },
        async getFichas(obj){
            const fichas = await FichaMedica.find();
            return fichas;
        }
        

        
    },
    
    
    Mutation: {
        async addDirectora(obj, {input}){
            const rutExistente = await Directora.findOne({Rut: input.Rut});
            if (rutExistente){
                throw new Error('ya existe un especialista con este RUT');
            }
            const directora=new Directora(input);
            await directora.save();
            return directora;
        },
        async addEspecialista(obj, {input}){
            const rutExistente = await Especialista.findOne({Rut: input.Rut});
            if (rutExistente){
                throw new Error('ya existe un especialista con este RUT');
            }
            const especialista=new Especialista(input);
            await especialista.save();
            return especialista;
        },
        async updateEspecialista(obj, {id,input}){
            const especialista= await Especialista.findByIdAndUpdate(id, input);
            return especialista;
        },

        async actualizarHorarios(obj, { id, horarios }) {
            try {
              const especialista = await Especialista.findById(id);
          
              // Verifica que horarios sea un array
              if (!Array.isArray(horarios)) {
                throw new Error('Los horarios deben ser un array de objetos');
              }
          
              // Convierte la cadena de fecha en un objeto Date para cada nuevo horario
              const nuevosHorarios = horarios.map((item) => ({
                fecha: new Date(item.fecha),
                hora: item.hora,
              }));
          
              // Si ya hay horarios existentes, agrégales los nuevos, de lo contrario, asigna los nuevos
              if (especialista.horarios && especialista.horarios.length > 0) {
                especialista.horarios = [...especialista.horarios, ...nuevosHorarios];
              } else {
                especialista.horarios = nuevosHorarios;
              }
          
              await especialista.save();
              return especialista;
            } catch (error) {
              console.log('Error al actualizar horario', error);
              throw new Error('Error al actualizar horarios');
            }
        },
          

        async deleteEspecialista(obj, {id}){
            await Especialista.deleteOne({_id:id});
            return {
                message:"Especialista eliminado"
            }
        },
        async addSecretaria(obj, {input}){
            const rutExistente = await Secretaria.findOne({Rut: input.Rut});
            if (rutExistente){
                throw new Error('ya existe un profesiona con cargo secretaria con este RUT');
            }
            const secretaria=new Secretaria(input);
            await secretaria.save();
            return secretaria;
        },
        async updateSecretaria(obj, {id,input}){
            const secretaria= await Secretaria.findByIdAndUpdate(id, input);
            return secretaria;
        },
        async deleteSecretaria(obj, {id}){
            await Secretaria.deleteOne({_id:id});
            return {
                message:"Cargo secretaria eliminado"
            }
        },
        async addPaciente(obj, {input}){
            const rutExistente = await Paciente.findOne({Rut: input.Rut});
            if (rutExistente){
                throw new Error('ya existe un profesiona con cargo secretaria con este RUT');
            }
            const paciente=new Paciente(input);
            await paciente.save();
            return paciente;
        },
        async updatePaciente(obj, {id,input}){
            const paciente= await Paciente.findByIdAndUpdate(id, input);
            return paciente;
        },
        async deletePaciente(obj, {id}){
            await Paciente.deleteOne({_id:id});
            return {
                message:"Paciente eliminado"
            }
        },
        async addAsistenteSocial(obj, {input}){
            const rutExistente = await AsistenteSocial.findOne({Rut: input.Rut});
            if (rutExistente){
                throw new Error('ya existe un Asistente Social con este RUT');
            }
            const asistenteSocial=new AsistenteSocial(input);
            await asistenteSocial.save();
            return asistenteSocial;
        },
        async updateAsistenteSocial(obj, {id,input}){
            const asistenteSocial= await AsistenteSocial.findByIdAndUpdate(id, input);
            return asistenteSocial;
        },
        async deleteAsistenteSocial(obj, {id}){
            await AsistenteSocial.deleteOne({_id:id});
            return {
                message:"Asistente Social eliminado"
            }
        },
        async updateContactoPaciente(_, { id, input }) {
            const pacienteToUpdate = await Paciente.findById(id);
            if (!pacienteToUpdate) {
                throw new Error('Paciente no encontrado');
            }
            
            pacienteToUpdate.telefono = input.telefono;
            pacienteToUpdate.email = input.email;
            pacienteToUpdate.Direccion = input.Direccion;
            await pacienteToUpdate.save();
            return pacienteToUpdate;
        },
        crearFichaMedica: async (_, { input }) => {
            try {
                console.log("Input recibido en crearFichaMedica:", input);
                // Verificar si el paciente existe

                const pacienteId = input.PacienteId;
                console.log("pacienteId", pacienteId);

                
                

                //const pacienteId = mongoose.Types.ObjectId(input.PacienteId);
                //console.log("pacienteId",pacienteId)
                const paciente = await Paciente.findById(pacienteId);
                //const paciente = await Paciente.findById(pacienteId);

                if (!paciente) {
                throw new Error('Paciente no encontrado');
                }

                

                //console.log("Tipo variable PacienteId",typeof(pacienteId))
                const fichaMedicaData = {
                    Paciente: paciente,
                    observaciones: input.observaciones,
                    historialMedico: input.historialMedico || []  
                }

                /*const fichaMedicaData = {
                    Paciente: pacienteId,
                    observaciones: input.observaciones,
                    historialMedico: input.historialMedico || []  
                };*/


                console.log("fichaMedicaData: ",fichaMedicaData)
                
                const fichaMedica = new FichaMedica(fichaMedicaData);
        
                await fichaMedica.save();

                paciente.tieneFichaMedica = true;

                await paciente.save();

                return fichaMedica;
            } catch (error) {
                // Manejo de errores
                console.error("Error al crear la ficha médica:", error);
                throw error; 
            }
        },
        agregarObservacion: async (_, { pacienteId, input }) => {
            try {
                const ficha = await FichaMedica.findOne({ Paciente: pacienteId }).populate('observaciones.especialista');
        
                if (!ficha) {
                    throw new Error("No se encontró la ficha médica del paciente");
                }
        
                const especialista = await Especialista.findById(input.especialistaId);
        
                if (!especialista) {
                    throw new Error("No se encontró el especialista");
                }
        
                const nuevaObservacionData = {
                    fecha: new Date().toISOString(),
                    especialista: especialista,
                    diagnostico: input.diagnostico,
                    notas: input.notas,
                    recomendaciones: input.recomendaciones,
                    asistencia: input.asistencia,
                    justificacion: input.justificacion
                };
        
                // Crea una nueva instancia de Observacion directamente
                const nuevaObservacion = ficha.observaciones.create(nuevaObservacionData);
        
                // Guarda la observación en la base de datos
                await nuevaObservacion.save();
        
                // Agrega la ID de la observación a la ficha médica
                ficha.observaciones.push(nuevaObservacion);
                await ficha.save();
        
                // Devuelve la observación completa con la ID
                return nuevaObservacion;
            } catch (error) {
                console.error('Error en handleAgregarObservacion:', error);
                throw error;
            }
        },
        
        
        agendarCita: async (_, {especialistaId, pacienteId, input}) => {
            try {

                const especialista = await Especialista.findById(especialistaId).lean(); //await faltaba
                console.log("ESPECIALSITA: ",especialista)
                const paciente = await Paciente.findById(pacienteId).lean();//await faltaba
                console.log(paciente)

                if (!paciente) {
                    console.log("Paciente no encontrado");
                    // Puedes manejar esto de alguna manera, ya sea lanzando un error o tomando otra acción.
                    return;
                }

                if (!especialista) {
                    console.log("especialista no encontrado");
                    // Puedes manejar esto de alguna manera, ya sea lanzando un error o tomando otra acción.
                    return;
                }


                const CitaHora = {
                    fecha: input.fecha,
                    hora: input.hora,
                    especialistaId: especialista,
                    pacienteId: paciente,
                    disponibilidad: input.disponibilidad
                }

                const CitaAgendanda =  new Cita(CitaHora)
                console.log("Cita creada")
                await CitaAgendanda.save()
                return CitaAgendanda

                
            } catch (error) {
                console.log("Error al crear cita: ",error)
                
            }
        },

        updateCitaDisponibilidad: async(_, {id, disponibilidad}) =>{
            try{
                const citaEncontrada = await Cita.findOne({_id:id})

                citaEncontrada.disponibilidad= disponibilidad

                await citaEncontrada.save()
                return citaEncontrada

            }catch(error){
                console.log("Eror al cambiar la disponibilidad de la cita")
            }
        },
        cancelarCita: async (_, { id }) => {
            await Cita.deleteOne({_id:id});
            return {
                message:"Cita eliminada"
            }
        },
        
        
        




        
        async iniciarSesion(_, {Rut, pass}){
            let user;
        
            const especialista = await Especialista.findOne({Rut});
            const directora = await Directora.findOne({Rut});
            const secretaria = await Secretaria.findOne({Rut});
            const asistenteSocial = await AsistenteSocial.findOne({Rut});
            
            if (especialista && especialista.Rut === Rut && especialista.pass === pass) {
                user = especialista;
            } else if (directora && directora.Rut === Rut && directora.pass === pass) {
                user = directora;
            } else if (secretaria && secretaria.Rut === Rut && secretaria.pass === pass) {
                user = secretaria;
            } else if (asistenteSocial && asistenteSocial.Rut === Rut && asistenteSocial.pass === pass) {
                user = asistenteSocial;
            } else {
                throw new Error('Rut o contraseña no encontrados');
            }
            
            if (user.estado === "deshabilitado") {
                throw new Error("No tiene permisos para acceder");
            }
            console.log(user._id)
            console.log(typeof user.Rut);

            
            return {
                message: 'Rut y Contraseña correcta',
                cargo: user.cargo,
                id: user._id,

                
            };
        },


        async UpdateEspecialistaEmail (_, {id, email}){
            try{
                const especialista = await Especialista.findOne({_id: id})
                console.log("especialista email", especialista)

                especialista.email = email
                console.log("Cambio realizado de correo")

                especialista.save()
                return especialista

            }catch(error){
                console.log("error al cambiar el correo de especialista",error)
                throw("error al cambiar el correo del especialista")
            }
             
        },

        async UpdateEspecialistaPassword(_,{id,pass}){
            try{
                //const especialista = await Especialista.findById(id);
                //console.log("especialista", especialista)

                const especialistaUpdatePass = await Especialista.findOne({_id: id})
                console.log("findOne",especialistaUpdatePass)

                especialistaUpdatePass.pass=pass
                await especialistaUpdatePass.save()
                return especialistaUpdatePass



            }catch(error){
                console.log("Error al cambiar la constraseña del especialista",error)
                throw new error("Error al cambiar la constraseña del especialista")
            }
        },

        async UpdateEspecialistaEstado(_, { id, estado }) {
            if (estado !== "habilitado" && estado !== "deshabilitado") {
              throw new Error('Valor de estado no válido');
            }
          
            try {
                const especialistaToUpdate = await Especialista.findOne({ _id: id });
                console.log("ID:", id);
                console.log("Estado:", estado);

              if (!especialistaToUpdate) {
                throw new Error('Especialista con ese RUT no encontrado');
              }
          
              especialistaToUpdate.estado = estado;
              await especialistaToUpdate.save();
          
              return especialistaToUpdate;
          
            } catch (error) {
              console.error("Error al actualizar el estado:", error.message);
              throw new Error('Error al actualizar el estado');
            }
        },
        async UpdateSecretariaEstado(_, { id, estado }) {
            if (estado !== "habilitado" && estado !== "deshabilitado") {
              throw new Error('Valor de estado no válido');
            }
          
            try {
                const secretariaToUpdate = await Secretaria.findOne({ _id: id });
                console.log("ID:", id);
                console.log("Estado:", estado);

              if (!secretariaToUpdate) {
                throw new Error('Secretaria con ese RUT no encontrado');
              }
          
              secretariaToUpdate.estado = estado;
              await secretariaToUpdate.save();
          
              return secretariaToUpdate;
          
            } catch (error) {
              console.error("Error al actualizar el estado:", error.message);
              throw new Error('Error al actualizar el estado');
            }
        },

        async UpdateSecretariaEmail (_, {id, email}){
            try{
                const secretaria = await Secretaria.findOne({_id: id})
                console.log("secretaria email", secretaria)

                secretaria.email = email
                console.log("Cambio realizado de correo")

                secretaria.save()
                return secretaria

            }catch(error){
                console.log("error al cambiar el correo de secretaria",error)
                throw("error al cambiar el correo del secretaria")
            }
             
        },

        async UpdateSecretariaPassword(_,{id,pass}){
            try{
                //const especialista = await Especialista.findById(id);
                //console.log("especialista", especialista)

                const secretariaUpdatePass = await Secretaria.findOne({_id: id})
                console.log("findOne",secretariaUpdatePass)

                secretariaUpdatePass.pass=pass
                await secretariaUpdatePass.save()
                return secretariaUpdatePass



            }catch(error){
                console.log("Error al cambiar la constraseña del secretaria",error)
                throw new error("Error al cambiar la constraseña del secretaria")
            }
        },

        async UpdateAsistenteSocialEstado(_, { id, estado }) {
            if (estado !== "habilitado" && estado !== "deshabilitado") {
              throw new Error('Valor de estado no válido');
            }
          
            try {
                const asistenteSocialToUpdate = await AsistenteSocial.findOne({ _id: id });
                console.log("ID:", id);
                console.log("Estado:", estado);

              if (!asistenteSocialToUpdate) {
                throw new Error('Asistente Social con ese RUT no encontrado');
              }
          
              asistenteSocialToUpdate.estado = estado;
              await asistenteSocialToUpdate.save();
          
              return asistenteSocialToUpdate;
          
            } catch (error) {
              console.error("Error al actualizar el estado:", error.message);
              throw new Error('Error al actualizar el estado');
            }
        },

        async UpdateAsistenteSocialEmail (_, {id, email}){
            try{
                const Asistentesocial = await AsistenteSocial.findOne({_id: id})
                console.log("Asistente social email", Asistentesocial)

                Asistentesocial.email = email
                console.log("Cambio realizado de correo")

                Asistentesocial.save()
                return Asistentesocial

            }catch(error){
                console.log("error al cambiar el correo de Asistente social",error)
                throw("error al cambiar el correo del Asistente social")
            }
             
        },

        async UpdateAsistenteSocialPassword(_,{id,pass}){
            try{


                const AsistentesocialPass = await AsistenteSocial.findOne({_id: id})
                console.log("findOne",AsistentesocialPass)

                AsistentesocialPass.pass=pass
                await AsistentesocialPass.save()
                return AsistentesocialPass



            }catch(error){
                console.log("Error al cambiar la constraseña del Asistente social",error)
                throw new error("Error al cambiar la constraseña del Asistente social")
            }
        },
        async actualizarObservaciones(obj, { idObservacion, diagnostico, notas, recomendaciones }) {
            try {
                const fichaMedica = await FichaMedica.findOne({ 'observaciones._id': idObservacion });
        
                const observacion = fichaMedica.observaciones.id(idObservacion);
        
                if (!observacion) {
                    throw new Error('Observación no encontrada');
                }
        
                observacion.diagnostico = diagnostico;
                observacion.notas = notas;
                observacion.recomendaciones = recomendaciones;
        
                await fichaMedica.save();
        
                return observacion;
            } catch (error) {
                console.error('Error al actualizar observación:', error);
                throw new Error('Error al actualizar observación');
            }
        },

        borrarObservacion: async (_, { id }) => {
            try {
              const resultado = await FichaMedica.findByIdAndUpdate(
                { _id: id },
                { $pull: { observaciones: { _id: id } } }
              );
      
              return { message: 'Observación eliminada' };
            } catch (error) {
              console.error('Error al borrar la observación:', error);
              throw new Error('No se pudo borrar la observación');
            }
          },
        async updateEspecialistaHorarios(_, { id, horarios }){
            try {
                const especialistaToUpdate = await Especialista.findById(id);

                if (!especialistaToUpdate) {
                  throw new Error('Especialista no encontrado');
                }

                // Revisa si hay horarios duplicados
                const existingHorarios = especialistaToUpdate.horarios.map(({ hora }) => hora);
                const newHorarios = horarios.map(({ hora }) => hora);

                const hasDuplicates = newHorarios.some((hora) => existingHorarios.includes(hora));

                if (hasDuplicates) {
                  throw new Error('No se pueden agregar horarios duplicados');
                }

                especialistaToUpdate.horarios = [...especialistaToUpdate.horarios, ...horarios];

                await especialistaToUpdate.save();
                return especialistaToUpdate;
              } catch (error) {
                throw new Error(error.message);
              }
        },
        
        

          
        
          

    },
    Cita: {
        especialista: async (parent, args, context, info) => {
            return await Especialista.findById(parent.especialistaId);
        },
        paciente: async (parent, args, context, info) => {
            return await Paciente.findById(parent.pacienteId);
        }
    }
};

let apolloServer = null;



const PORT =process.env.PORT //aqui se llama al puerto definido 

const corsOptions ={
    origin : "http://localhost:" + PORT, //Se agrega aqui el llamado del puerto
    credentials: false
};

async function startServer(){
    const apolloServer = new ApolloServer({typeDefs, resolvers, context: ({req, res}) => ({req,res}),corsOptions});
    await apolloServer.start();

    apolloServer.applyMiddleware({app,path: '/api/graphql',cors: false});
}

startServer();

const app = express();
app.use(cors());



app.listen(PORT, function(){
    console.log("Servidor iniciado"); //Se agrega aqui el llamado del puerto
})