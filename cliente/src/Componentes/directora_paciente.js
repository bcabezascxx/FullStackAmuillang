import { useQuery, gql, useMutation } from "@apollo/client";
import React, { useState, useEffect } from 'react';
import Nav from "./nav";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import {validateRut} from "rutlib"


import FichaMedica from "./VerFichaMedica"; 
import { useNavigate } from "react-router-dom";


function calcularEdad(fechaNacimiento) {
  const fechaNac = new Date(fechaNacimiento);
  const fechaActual = new Date();

  const diferenciaAnios = fechaActual.getFullYear() - fechaNac.getFullYear();
  const diferenciaMeses = fechaActual.getMonth() - fechaNac.getMonth();
  const diferenciaDias = fechaActual.getDate() - fechaNac.getDate();

  

  // Ajusta la edad si aún no ha pasado el cumpleaños de este año
  if (diferenciaMeses < 0 || (diferenciaMeses === 0 && diferenciaDias < 0)) {
    return diferenciaAnios - 1;
  } else {
    return diferenciaAnios;
  }
}

const GET_PACIENTES = gql`
  query  {
    getPacientes {
      id
      Rut
      edad
      nombre
      sexo
      apellido
      telefono
      email
      Direccion
      FechaNacimiento
    }
  }
`;

const DELETE_PACIENTE = gql`
  mutation deletePaciente($id: ID!){
    deletePaciente(id: $id){
      message
    }
  }
`;

const ADD_PACIENTE = gql`
  mutation addPaciente($input: PacienteInput){
    addPaciente(input: $input){
      id
      Rut
      edad
      nombre
      sexo
      apellido
      telefono
      email
      Direccion
      FechaNacimiento
      tieneFichaMedica
    }
  }
`;

export default function Directora_paciente() {

  const navigate = useNavigate();

  const [MensajeVerificacion, setMensajeVerificacionFicha] = useState(false)
  const [idCreado, setIdCreado] = useState('')
  
  const { loading, error, data, refetch } = useQuery(GET_PACIENTES);
  const [addPaciente, { dataadd, loadingadd, erroradd }] = useMutation(ADD_PACIENTE);
  const [deletePaciente, { dataDelete, loadingDelete, errorDelete }] = useMutation(DELETE_PACIENTE);

  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [sexo, setSexo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(null); // Usamos null como valor inicial
  const [tieneFichaMedica, setTieneFichaMedica] = useState('');

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [mensajeRutError, setMensajeRutError] = useState('El RUT no es valido');
  const handleChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue && validateRut(inputValue)) {
          setMensajeRutError("El RUT es válido");
          setIsButtonDisabled(false);
        } else {
          setMensajeRutError("El RUT no es válido");
          setIsButtonDisabled(true);
        }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const edadCalculada = calcularEdad(fechaNacimiento);

      const { data: dataadd } = await addPaciente({
        variables: {
          input: {
            Rut: rut,
            edad: edadCalculada,
            nombre: nombre,
            sexo: sexo,
            apellido: apellido,
            telefono: parseInt(telefono, 10),
            email: email,
            Direccion: Direccion,
            FechaNacimiento: format(fechaNacimiento, 'dd-MM-yyyy'), // Formatear la fecha como día-mes-año,
            tieneFichaMedica: false



            
          },
        },
        refetchQueries: [{ query: GET_PACIENTES }],
      });
      if (dataadd && dataadd.addPaciente.id) {
        setMensajeVerificacionFicha(true)
        setIdCreado(dataadd.addPaciente.id)
      }
    } catch (error) {
      console.error("Error al agregar paciente: ", error.message);
      if (error.graphQLErrors) console.error("GraphQL Errors:", error.graphQLErrors);
      if (error.networkError) console.error("Network Errors:", error.networkError);
    }

    // Restablece el estado
    setRut('');
    setNombre('');
    setApellido('');
    setSexo('');
    setTelefono('');
    setEmail('');
    setDireccion('');
    setFechaNacimiento(null); // Reiniciar la fecha de nacimiento
    setTieneFichaMedica(false);
  };

  const handleDeleteDirectly = async (pacienteId) => {
    try {
      const { data } = await deletePaciente({ variables: { id: pacienteId } });
      console.log(data.deletePaciente.message);
      refetch();
    } catch (err) {
      console.error("Error al eliminar paciente:", err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar datos: {error.message}</p>;


const ValidarRut = (Entrada) => {
    const ValorLimpioInput = Entrada.replace(/[^\d-]/g, '');
  
    if (
      /^[0-9]{8,9}-[0-9]$/.test(ValorLimpioInput) ||
      /^[0-9]{7,8}-[0-9]$/.test(ValorLimpioInput)
    ) {
        setRut(ValorLimpioInput);
    } else {
        setRut(Entrada); 

    }
};

  
const handleChangeRut = (e) => {
    ValidarRut(e.target.value);
};

  return (
    <div>
      <div>
        <Nav />
      </div>
      <div>
        <h2>Pacientes :</h2>
        <div className="row">
          {data.getPacientes.map((pac) => (
            <div className="col-md-4" key={pac.id}>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">{pac.nombre} {pac.apellido}</h5>
                  <p className="card-text">RUT: {pac.Rut}</p>
                  <p className='card-text'>EDAD: {pac.edad}</p>
                  <p className='card-text'>SEXO: {pac.sexo}</p>
                  <p className='card-text'>TELEFONO: {pac.telefono}</p>
                  <p className='card-text'>EMAIL: {pac.email}</p>
                  <p className='card-text'>DIRECCIÓN: {pac.Direccion}</p>
                  <p className='card-text'>Fecha de nacimiento: {pac.FechaNacimiento}</p>
                </div>
                <button className='btn btn-light' onClick={() => handleDeleteDirectly(pac.id)}><span style={{ color: "Red" }}>Eliminar</span></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Agregar pacientes</h2>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card p-4 shadow">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">RUT:</label>
                    <input type="text" className="form-control" value={rut} onChange={ (e) => { setRut(e.target.value); handleChange(e)}} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Apellido:</label>
                    <input type="text" className="form-control" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">SEXO:</label>
                    <select className="form-control" value={sexo} onChange={(e) => setSexo(e.target.value)}>
                      <option value="">Selecciona un sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Telefono:</label>
                    <input type="number" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dirección :</label>
                    <input type="text" className="form-control" value={Direccion} onChange={(e) => setDireccion(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha de nacimiento:</label>
                    <DatePicker
                      selected={fechaNacimiento}
                      onChange={date => setFechaNacimiento(date)}
                      className="form-control"
                      dateFormat="dd-MM-yyyy"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={50}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                  {MensajeVerificacion && (
                      (() => navigate('/FichaMedica/' + idCreado))()
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}