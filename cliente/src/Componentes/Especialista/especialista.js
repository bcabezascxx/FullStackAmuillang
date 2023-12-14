import "bootstrap/dist/css/bootstrap.min.css"
import { useQuery, useMutation, gql } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import './App.css';
import Footer from './Footer';
import Nav from "./nav"
import "./Especialista.css"
import { useLocation, Link, useNavigate } from 'react-router-dom';
import moment from 'moment';



const GET_ESPECIALISTAS = gql`
  query {
    getEspecialistas {
      id
      Rut
      pass
      nombre
      apellido
      cargo
      estado
      asistencia {
        fecha
        presente
      }
      horarios {
        fecha
        hora
      }
    }
  }
`

const GET_ESPECIALISTA_ID = gql`
  query getEspecialista($id: ID) {
    getEspecialista(id: $id) {
      id
      Rut
      nombre
      apellido
      cargo
      estado
    }
  }
`;





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
`

const GET_CITAS = gql`
  query getCitas {
    getCitas {
      id
      especialista{
        Rut
        nombre
        apellido
        cargo
      } 
      paciente{
        nombre
        apellido
        Rut
      }  
      fecha
      hora
      disponibilidad
    }
  }
`


const UPDATE_HORARIO= gql`
  mutation actualizarHorarios($id: ID, $horarios: [HorarioInput]){
    actualizarHorarios(id:$id, horarios: $horarios){
      id
      Rut
      nombre
      apellido
      cargo
      estado
      horarios{
        fecha
        hora
      }

    }

  }

`




function Especialista() {

  const { state } = useLocation();
  const especialistaId = state?.especialistaId || sessionStorage.getItem('especialistaId');
  console.log(typeof especialistaId)
  console.log("ID TRAIDA: ",especialistaId)
  
  const navigate=useNavigate()

  if (especialistaId === null) {
    navigate("/");
  }

  const { loading: loadingEspecialistas, error: errorEspecialistas, data: dataEspecialistas } = useQuery(GET_ESPECIALISTAS);
  const { loading: loadingPacientes, error: errorPacientes, data: dataPacientes } = useQuery(GET_PACIENTES);
  const { loading: loadingCitas, error: errorCitas, data: dataCitas } = useQuery(GET_CITAS);
  const { loading, error, data } = useQuery(GET_ESPECIALISTA_ID, {
    variables: { id: especialistaId.toString() }
  });
  const [actualizarHorarios] = useMutation(UPDATE_HORARIO);

  

  useEffect(() => {

    console.log('Componente montado con ID:', especialistaId);
    if (especialistaId===null){
      navigate("/")
    }


    return () => {
      console.log('Componente desmontado');
    };
  }, [especialistaId]);

  
  const [numHorarios, setNumHorarios] = useState(1);
  const [horarios, setHorarios] = useState([]);

  


  if (loadingEspecialistas || loadingPacientes || loadingCitas || loading ) {
    return <p>Loading...</p>;
  }

  if (errorEspecialistas || errorPacientes || error ) {
    return <p>Error loading data</p>;
  }

  if (loadingEspecialistas || loadingPacientes || loadingCitas || loading) {
    return <p>Loading...</p>;
  }
  
  if (errorEspecialistas || errorPacientes || error) {
    return <p>Error loading data</p>;
  }
  

  const especialista = dataEspecialistas.getEspecialistas && dataEspecialistas.getEspecialistas.find(especialista => especialista.id === especialistaId);


  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filterCitas = (citas, type) => {
    const currentDate = getCurrentDate();
    const rutEspecialista = dataCitas.getCitas && data.getEspecialista && data.getEspecialista?.Rut;
    console.log(dataCitas.getCitas)
    if (type === 'today') {
      return citas.filter((cita) => cita.fecha === currentDate && cita.especialista.Rut === rutEspecialista);
    } else if (type === 'upcoming') {
      return citas.filter((cita) => cita.fecha > currentDate && cita.especialista.Rut === rutEspecialista);
    } else if (type === 'past'){
      return citas.filter((cita) => cita.fecha<currentDate && cita.especialista.Rut === rutEspecialista);
    }

    return [];
  };


  /*const handleActualizarHoras = async (e) => {
    e.preventDefault();
    try {
      console.log(especialistaId);
      console.log(horarios);
  
      // Extrae las propiedades fecha y hora de cada objeto en el array
      const horariosParaEnviar = horarios.map(({ fecha, hora }) => ({ fecha, hora }));
  
      console.log(horariosParaEnviar);
  
      const { data:actualizar } = await actualizarHorarios({
        variables: {
          id: data.getEspecialista.id,
          horarios: horariosParaEnviar,
        },
      });
      console.log('Horarios actualizados:', actualizar);
    } catch (error) {
      console.log('error', error);
    }
  };*/

  /*const handleAgregarHorario = () => {
    setNumHorarios((prevNumHorarios) => prevNumHorarios + 1);
    setHorarios((prevHorarios) => [...prevHorarios, { fecha: '', hora: '' }]);
  };

  const handleInputChange = (index, key, value) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index][key] = value;
    setHorarios(nuevosHorarios);
  };*/

  return (
    <div className="App">
      <Nav />
      <h2 className="text-align center"><strong>Datos especialista</strong></h2>
      <div className="container">
        <div className='row'>
          <div className="col-12">
            <table className="table table-hover">
                <tr className="table-success">
                  <th scope="col" className="col-sm-3 m-2"><h6><strong>Nombre y apellido profesional: </strong></h6></th>
                    <td className="col-sm-9">{dataCitas.getCitas && data.getEspecialista?.nombre } {dataCitas.getCitas && data.getEspecialista?.apellido}</td>
                </tr>
                <tr className="table-success">
                  <th scope="col" className="col-sm-3 m-2"><h6><strong>Cargo: </strong></h6></th>
                  <td className="col-sm-9">{dataCitas.getCitas && data.getEspecialista?.cargo}</td>
                </tr>
                <tr className="table-success">
                  <th scope="col" className="col-sm-3 m-2"><h6><strong>Estado: </strong></h6></th>
                  <td className="col-sm-9">{dataCitas.getCitas && data.getEspecialista?.estado}</td>
                </tr>
            </table>
          </div>
        </div>
        <div className="row ">
          <div className="text-align center">
            <Link to="/especialista/agregarHoras">
              <button className="btn btn-primary" style={{width: "15rem"}}> Agregar horas</button>
            </Link>
          </div>
        </div>
      </div>

      <br/>


    <div className="container">
      <div className="upcoming-appointments">
      <h3 className="mb-3 text-center">Citas de hoy: </h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>RUT</th>
          </tr>
        </thead>
        <tbody>
          {filterCitas(dataCitas.getCitas && dataCitas.getCitas, 'today').map((cita) => (
              <tr key={cita.id}>
                <td>{moment(cita.fecha).format("DD-MM-YYYY")}</td>
                <td>{cita.hora}</td>
                <td>{cita.paciente.nombre} {cita.paciente.apellido}</td>
                <td>{cita.paciente.Rut} </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>

      <div className="upcoming-appointments">
      <h3 className="mb-3 text-center">Proximas citas </h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>RUT</th>
          </tr>
        </thead>
        <tbody>
          {filterCitas(dataCitas.getCitas, 'upcoming').map((cita) => (
              <tr key={cita.id}>
                <td>{moment(cita.fecha).format("DD-MM-YYYY")}</td>
                <td>{cita.hora}</td>
                <td>{cita.paciente.nombre} {cita.paciente.apellido}</td>
                <td>{cita.paciente.Rut} </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>

      <div className="upcoming-appointments">
      <h3 className="mb-3 text-center">Citas pasadas </h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>RUT</th>
          </tr>
        </thead>
        <tbody>
          {filterCitas(dataCitas.getCitas, 'past').map((cita) => (
              <tr key={cita.id}>
                <td>{moment(cita.fecha).format("DD-MM-YYYY")}</td>
                <td>{cita.hora}</td>
                <td>{cita.paciente.nombre} {cita.paciente.apellido}</td>
                <td>{cita.paciente.Rut} </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>

    </div>
      {/*
      <div className="container">
        <form onSubmit={handleActualizarHoras}>
        <div className="mb-3">
          <label className="form-label">Número de horarios a donar:</label>
          <select
            value={numHorarios}
            onChange={(e) => {
              setNumHorarios(Number(e.target.value));
              setHorarios(Array.from({ length: Number(e.target.value) }, () => ({ fecha: '', hora: '' })));
            }}
            className="form-control"
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {horarios.map((horario, index) => (
          <div key={index}>
            <div className="mb-3">
              <label className="form-label">{`Fecha de horario ${index + 1}:`}</label>
              <input
                type="date"
                className="form-control"
                value={horario.fecha ? horario.fecha.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const nuevosHorarios = [...horarios];
                  nuevosHorarios[index].fecha = new Date(e.target.value);
                  setHorarios(nuevosHorarios);
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{`Hora de horario ${index + 1}:`}</label>
              <input
                type="time"
                className="form-control"
                value={horario.hora}
                onChange={(e) => {
                  const nuevosHorarios = [...horarios];
                  nuevosHorarios[index].hora = e.target.value;
                  setHorarios(nuevosHorarios);
                }}
              />
            </div>
          </div>
        ))}

        <button type="button" onClick={handleAgregarHorario}>
          Agregar Horarios
        </button>

        <button type="submit" disabled={loading}>
          Actualizar Horarios
        </button>

        {error && <p>Error al actualizar horarios. Inténtalo de nuevo.</p>}
      </form>
      </div>*/}
      


      <br></br>
      <Footer />
    </div>
  );
}

export default Especialista;