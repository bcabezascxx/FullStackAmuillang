import React, { useState, useEffect } from 'react';
import './style.css';
import { gql, useQuery, useMutation } from "@apollo/client";
import Nav from "./nav";
import moment from 'moment-timezone';
import { validateRut } from 'rutlib';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';



moment.tz.setDefault('America/Santiago');

const CREAR_CITA = gql`
  mutation agendarCita($pacienteId: ID, $especialistaId: ID ,$input: CitaInput){
    agendarCita(pacienteId: $pacienteId, especialistaId: $especialistaId, input: $input){
      id
      fecha
      hora
      disponibilidad
    }
  }
`

const GET_CITAS = gql`
  query getCitas {
    getCitas {
      id
      especialista{
        nombre
        apellido
        cargo
      } 
      paciente{
        Rut
        nombre
        apellido
      }  
      fecha
      hora
      disponibilidad
    }
  }
`

const GET_ESPECIALISTAS = gql`
  query getEspecialistas {
    getEspecialistas {
      id
      nombre
      apellido
      horarios {
        fecha
        hora
      }
      cargo
      estado
    }
  }
`

const GET_PACIENTES = gql`
  query getPacientes {
    getPacientes {
      id
      nombre
      apellido
      Rut
    }
  }
`

const UPDATE_DISPONIBILIDAD = gql`
  mutation updateCitaDisponibilidad($id: ID, $disponibilidad: Boolean){
    updateCitaDisponibilidad(id: $id, disponibilidad:$disponibilidad){
        id
        disponibilidad
    }
  }
`

const crearEventoDisponible = (fechaHora, disponibilidad, especialista = null) => ({
  title: 'Disponible',
  start: moment(fechaHora).toDate(),
  end: moment(fechaHora).toDate(),
  disponibilidad,
  especialista,
});

const getEspecialistaDisponible = (especialistas, fechaHora) => {
  const fechaHoraMoment = moment(fechaHora);

  const especialistaDisponible = especialistas.find((especialista) => {
    return especialista.horarios.some((horario) => {
      const horarioMoment = moment(horario.fecha).set({
        hour: horario.hora.split(':')[0],
        minute: horario.hora.split(':')[1],
        second: 0,
        millisecond: 0,
      });

      return fechaHoraMoment.isSame(horarioMoment);
    });
  });

  return especialistaDisponible || null;
};

const filtrarCitasDisponibles = (citasDisponibles, citasNoDisponibles) => {
  return citasDisponibles.filter((citaDisponible) => {
    const fechaHoraMoment = moment(citaDisponible.start).add(1, 'days'); // Agrega un día extra

    // Verificar si la fecha y hora de la cita disponible no coincide con ninguna cita no disponible
    return !citasNoDisponibles.some((citaNoDisponible) =>
      moment(citaNoDisponible.fecha).isSame(fechaHoraMoment, 'minute')
    );
  });
};


export default function Agenda() {
  const { data: getCitas, error: errorgetCitas, refetch: refetchPacientes } = useQuery(GET_CITAS);
  const { data: getEspecialistas, error: errorgetEspecialistas } = useQuery(GET_ESPECIALISTAS);
  const { data: getPacientes, error: errorgetPacientes } = useQuery(GET_PACIENTES);

  const [eventosCitas, setEventosCitas] = useState([]);
  const [eventosDisponibles, setEventosDisponibles] = useState([]);

  useEffect(() => {
    if (getCitas && getCitas.getCitas && getEspecialistas?.getEspecialistas) {

      // Ordenar las citas por el nombre del especialista
      const citasOrdenadas = [...getCitas.getCitas].sort((a, b) => {
        const nombreA = `${a.especialista.nombre} ${a.especialista.apellido}`;
        const nombreB = `${b.especialista.nombre} ${b.especialista.apellido}`;
        return nombreA.localeCompare(nombreB);
      });

      setEventosCitas(citasOrdenadas);

      const fechasHorasDisponibles = obtenerFechasHorasDisponibles(
        getEspecialistas.getEspecialistas,
        getCitas.getCitas
      );

      // Crear eventos de citas disponibles
      const eventosDisponibles = fechasHorasDisponibles.map((fechaHora) =>
        crearEventoDisponible(fechaHora, true, getEspecialistaDisponible(getEspecialistas?.getEspecialistas || [], fechaHora))
      );

      // Filtrar eventos disponibles utilizando la función filtrarCitasDisponibles
      const eventosDisponiblesFiltrados = filtrarCitasDisponibles(eventosDisponibles, getCitas.getCitas);

      setEventosDisponibles(eventosDisponiblesFiltrados);
    }
  }, [getCitas, getEspecialistas]);



  const obtenerFechasHorasDisponibles = (especialistas, citas) => {
    // Crear un conjunto de fechas y horas ocupadas
    const citasOcupadas = new Set(citas.map(cita => moment(cita.fecha).toISOString()));
  
    // Obtener todas las fechas y horas disponibles
    const fechasHorasDisponibles = especialistas.flatMap(especialista =>
      especialista.horarios.map(horario => {
        const fechaHora = moment.tz(parseInt(horario.fecha), 'America/Santiago').set({
          hour: horario.hora.split(':')[0],
          minute: horario.hora.split(':')[1],
          second: 0,
          millisecond: 0
        }).add(1, 'days');
  
        return fechaHora.toISOString();
      })
    );
  
    // Filtrar fechas y horas disponibles que no están en la base de citas
    const fechasHorasDisponiblesFiltradas = fechasHorasDisponibles.filter(
      (fechaHora) => !citasOcupadas.has(moment(fechaHora).toISOString())
    );
  
    // Eliminar fechas de citas disponibles que coinciden con citas no disponibles
    const eventosDisponibles = fechasHorasDisponiblesFiltradas.map(fechaHora =>
      crearEventoDisponible(fechaHora, true, getEspecialistaDisponible(getEspecialistas?.getEspecialistas || [], fechaHora))
    ).filter(evento =>
      !citas.some(cita => moment(cita.fecha).isSame(moment(evento.start)))
    );
  
    setEventosDisponibles(eventosDisponibles);
  
    return fechasHorasDisponiblesFiltradas;
  };
  
  const getInformacionEspecialistaDisponible = (fechaHora) => {
    const especialista = getEspecialistaDisponible(getEspecialistas?.getEspecialistas || [], fechaHora);
  
    console.log("Especialista disponible:", especialista); // Agrega esta línea
  
    if (especialista) {
      const { nombre, apellido, cargo } = especialista;
      console.log("Información del especialista:", nombre, apellido, cargo); // Agrega esta línea
      return { nombre, apellido, cargo };
    }
  
    return null;
  };
  
  
  
  const getEspecialistaById = (id) => {
    return getEspecialistas?.getEspecialistas.find((especialista) => especialista.id === id) || null;
  };

  const getPacienteById = (id) => {
    return getPacientes?.getPacientes.find((paciente) => paciente.id === id) || null;
  };

  const handleUpdateDisponibilidad = async (id, disponibilidad) => {
    // Lógica para actualizar disponibilidad (puedes usar la mutación)
  };

  const fecha= new Date()
  console.log(fecha)


  return (
    <div>
      <div>
        <Nav />
      </div>
      <div className='container'>
        <h1>Visualización de Citas</h1>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th className="d-sm-table-cell">Fecha</th>
                <th className="d-sm-table-cell">Hora</th>
                <th className="d-md-table-cell">Especialista</th>
                <th className="d-none d-md-table-cell">Cargo</th>
                <th className="d-md-table-cell">Paciente</th>
                <th className="d-md-table-cell">Rut Paciente</th>
                <th>Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              {eventosCitas.map((cita) => (
                <tr key={cita.id}>
                  {cita.fecha>=moment(fecha).format('YYYY-MM-DD') && cita.hora>=moment(fecha).format('HH:mm') && (
                    <>
                      <td className="d-sm-table-cell">{moment(cita.fecha).format("DD-MM-YYYY")}</td>
                      <td className="d-sm-table-cell">{cita.hora}</td>
                      <td className="d-md-table-cell">{cita.especialista ? `${cita.especialista.nombre} ${cita.especialista.apellido}` : ''}</td>
                      <td className="d-none d-md-table-cell">{cita.especialista ? cita.especialista.cargo : ''}</td>
                      <td className="-md-table-cell">{cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellido}` : ''}</td>
                      <td className="d-md-table-cell">{cita.paciente ? `${cita.paciente.Rut}` : ''}</td>
                      <td>
                        {cita.disponibilidad ? (
                          <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
    
                        ) : (
                          <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}