import React, { useState, useEffect } from 'react';
import './style.css';
import { gql, useQuery, useMutation } from "@apollo/client";
import Nav from "./nav";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { validateRut } from 'rutlib';
import emailjs from 'emailjs-com';

const localizer = momentLocalizer(moment);

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

const BUSCAR_PACIENTE_POR_RUT = gql`
    query buscarPacientePorRut($Rut: String!) {
        buscarPacientePorRut(Rut: $Rut) {
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

const GET_CITAS = gql`
  query getCitas {
    getCitas {
      id
      especialista{
        nombre
        apellido
        cargo
        Rut
      } 
      paciente{
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
      Rut
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

const GET_ESPECIALISTAS_ID= gql`
  query getEspecialista($id: ID){
    getEspecialista(id: $id){
      Rut
      nombre
      apellido
      horarios{
        fecha
        hora
      }
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

const GET_PACIENTE_ID = gql`
  query getPaciente($id:ID){
    getPaciente(id:$id){
      Rut
      nombre
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

const CANCELAR_CITA = gql`
  mutation cancelarCita($id: ID!){
    cancelarCita(id:$id){
      message
    }
  }
`

export default function Agenda() {
  const [agendarCita] = useMutation(CREAR_CITA)
  const { data: getCitas, error: errorgetCitas, refetch: refetchPacientes } = useQuery(GET_CITAS)
  const { data: getEspecialistas, error: errorgetEspecialistas } = useQuery(GET_ESPECIALISTAS)
  const { data: getPacientes, error: errorgetPacientes } = useQuery(GET_PACIENTES)
  const [updateCitaDisponibilidad] = useMutation(UPDATE_DISPONIBILIDAD)
  const [cancelarCita] = useMutation(CANCELAR_CITA);
  const [especialistaRut, setEspecialistaRut] = useState('')

  const [eventosCalendario, setEventosCalendario] = useState([]);
  const [Rut, setRut] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { data: getBuscarPorRut, refetch: refetchBusqueda } = useQuery(BUSCAR_PACIENTE_POR_RUT, { skip: true });
  const {data: getPacienteporId} = useQuery(GET_PACIENTE_ID)
  const {data: getEspecialistaporId} = useQuery(GET_ESPECIALISTAS_ID)
  const [mensajeError, setMensajeError] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [mensajeResultado, setMensajeResultado] = useState("");
  const [mostrarFormularioEspecialidad, setMostrarFormularioEspecialidad] = useState(false);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [especialistasFiltered, setFilteredEspecialistas] = useState('')
  const [hassearch, setHasSearched] = useState(false)
  const [mensaje, setMensaje]= useState('')

  const [selectedCargo, handleSelectCargo] = useState('')
  const [rutPaciente, setRutPaciente] = useState('')
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [MensajeAgendado,setMensajeAgendado] = useState('')
  const [FechaValida, setFechaValida] = useState([])
  const [HoraValida, setHoraValida] = useState([])

  

  


  useEffect(() => {
    if (getCitas && getCitas.getCitas) {
      const eventos = transformarCitasParaCalendario(getCitas.getCitas);
      setEventosCalendario(eventos);
    }
  }, [getCitas]);

  const transformarCitasParaCalendario = (citas, cargoEspecialista) => {
    const eventos = citas
      .filter((cita) => cita.especialista.cargo === cargoEspecialista)
      .map((cita) => ({
        title: `${cita.especialista.nombre} ${cita.especialista.apellido} - ${cita.paciente.nombre} ${cita.paciente.apellido}`,
        start: new Date(`${cita.fecha}T${cita.hora}`),
        end: new Date(`${cita.fecha}T${cita.hora}`),
        disponibilidad: cita.disponibilidad,
        id: cita.id
      }));
    return eventos;
  };
  
  

  const [datosCita, setDatosCita] = useState({
    fecha: '',
    hora: '',
    disponibilidad: false
  })

  const [BotonValidacion,setBotonValidacion] = useState(false)

  const getEspecialistaById = (id) => {
    return getEspecialistas?.getEspecialistas.find((especialista) => especialista.id === id) || null;
  };

  const getPacienteById = (id) => {
    return getPacientes?.getPacientes.find((paciente) => paciente.id === id) || null;
  };

  const [pacienteId, setPacienteId] = useState('')
  const [especialistaId, setEspecialistaId] = useState('')


  const { data, error: errorGetIdEspecialista, loading: loadingGetIdEspecialista } = useQuery(GET_ESPECIALISTAS_ID, {
    variables: {
      id: especialistaId, 
    },
  });


  const ComponenteQueUtilizaCorreo = ({pacienteId, especialistaId, datosCita}) => {
    const { loading: loadingPaciente, error: errorPaciente, data: pacienteData } = useQuery(GET_PACIENTE_ID, {
      variables: { id: pacienteId.toString() },
    });
  
  const { loading: loadingEspecialista, error: errorEspecialista, data: especialistaData } = useQuery(GET_ESPECIALISTAS_ID, {
    variables: { id: especialistaId.toString() },
  });

    // Manejo de loading y error
    if (loadingPaciente || loadingEspecialista) return <p>Cargando...</p>;
    if (errorPaciente || errorEspecialista) return <p>Error: {errorPaciente ? errorPaciente.message : errorEspecialista.message}</p>;

    const pacienteInformacion = pacienteData ? pacienteData.getPaciente : null;
    const especialistaInformacion = especialistaData ? especialistaData.getEspecialista : null;

    handleEnviodeCorreo(pacienteInformacion,especialistaInformacion,datosCita)


  }

  const handleEnviodeCorreo = async () => {
    try {
      const especialistas = getEspecialistas?.getEspecialistas || [];
      const pacientes = getPacientes?.getPacientes || [];

      const especialista = getEspecialistaById(especialistaId, especialistas);
      const paciente = getPacienteById(pacienteId, pacientes);

      const rutEspecialista = especialista ? especialista.Rut : null
      const nombreEspecialista = especialista ? especialista.nombre : null
      const apellidoEspecialista = especialista ? especialista.apellido : null

      const rutPaciente = paciente ? paciente.Rut : null
      const nombrePaciente = paciente ? paciente.nombre : null
      const apellidoPaciente = paciente ? paciente.apellido : null

      const diaCita = new Date(parseInt(datosCita.fecha)).toISOString().split('T')[0];

      const servicioCorreo = 'service_r7yijvw';
      const templateID = 'template_pr3djfa';
      const userID = 'jhMkGddPANojUpI5z';

      const mensaje = {
        nombre_paciente: nombrePaciente,
        apellido_paciente: apellidoPaciente,
        rut_paciente: rutPaciente,
        nombre_especialista: nombreEspecialista,
        rut_especialista: rutEspecialista,
        apellido_especialista: apellidoEspecialista,
        dia_cita: diaCita,
        dia_hora: datosCita.hora,
        subject: 'Cita agendada',
      };

      const response = await emailjs.send(servicioCorreo, templateID, mensaje, userID);
      console.log('Correo enviado con éxito:', response);
    } catch (error) {
      console.log("error al enviar correo", error);
    }
  }



  const handleAgregarCita = async (event) => {
    event.preventDefault();
  
    try {     
      const especialistaData = data;
      const especialista = data.getEspecialista;
      console.log("ESPE", especialista.Rut)

      setEspecialistaRut(especialista.Rut);
  
      const fechaFormateada2 = new Date(parseInt(datosCita.fecha)).toISOString().split('T')[0];
      console.log("Verificación",especialista.Rut)
      console.log("Verificación2",fechaFormateada2)
      console.log("Verificación3",datosCita.hora)
  
      const citaExistente = getCitas.getCitas.find((cita) => {
        const condicionesCoincidencia =
          cita.especialista.Rut === especialista.Rut &&
          cita.fecha === fechaFormateada2 &&
          cita.hora === datosCita.hora;
  
        console.log("A",cita.especialista.rut)
        console.log("Condiciones de coincidencia:", condicionesCoincidencia);
        console.log("Valores específicos para la cita:", cita);
        console.log("FECHA", fechaFormateada2);
        console.log("HORA", datosCita.hora);
  
        return condicionesCoincidencia;
      });
  
      console.log("CitaExistente:", citaExistente);

      

      if (citaExistente) {
        setMensajeAgendado("Fecha ya agendada");
        return;
      }
  
      
      try {
        console.log("pacienteId", pacienteId);
        console.log("especialistaId", especialistaId);
        console.log("fecha: ", datosCita.fecha);
        console.log("hora: ", datosCita.hora);
        console.log("disponibilidad", datosCita.disponibilidad);
  
        const fechaFormateada = new Date(parseInt(datosCita.fecha)).toISOString().split('T')[0];
  
        console.log(fechaFormateada);
        console.log(pacienteId, especialistaId,  fechaFormateada, datosCita.hora,datosCita.disponibilidad)
        if (pacienteId && especialistaId && fechaFormateada && datosCita.hora && datosCita.hora!='' && pacienteId!='' && especialistaId!=''){
          const { data } = await agendarCita({
            variables: {
              pacienteId: pacienteId.toString(),
              especialistaId: especialistaId.toString(),
              input: {
                fecha: fechaFormateada,
                hora: datosCita.hora,
                disponibilidad: datosCita.disponibilidad,
              },
            },
          });
          console.log("Cita creada");


          
          
          refetchPacientes();
    
          
          setDatosCita({
            fecha: "",
            hora: "",
            disponibilidad: false,
          });

          handleEnviodeCorreo()
          
        }
        else{
          console.log("eror al crear")
          setMensajeAgendado("Error al crear cita");
          return
        }
  
        
      } catch (error) {
        console.log("Error al crear cita", error);
        
      }
    } catch (error) {
      console.log("Error al obtener especialista", error);
      
    }
    
  };
  

  

  const handleSelectEvent = async (event) => {
    const { id, disponibilidad } = event;

    if (!disponibilidad){
      const confirmarCancelar = window.confirm('¿Desea cancelar esta cita?');
      if (confirmarCancelar){
        try{
          await cancelarCita({
            variables: {
              id,
            },
          });
          refetchPacientes();
        }catch(error){
          console.log("error al cancelar la cita",error)
        }
      }
    };
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.disponibilidad ? 'green' : 'red';
    const style = {
      backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style
    };
  }

  const handleChange = (a) => {
    console.log(validateRut(a.target.value))
    if ( a.target.value && validateRut(a.target.value)) { 
        setIsButtonDisabled(false);
    }
    else {
        setIsButtonDisabled(true);
    } 
  }
  const handleSearch = async (e) => {
    e.preventDefault();
    
    BuscarPorRut();
    setIsButtonDisabled(true); 
  };

  const {data:especialistaData} = useQuery(GET_ESPECIALISTAS_ID, {variables:{id:especialistaId.toString()}})
  const BuscarPorRut = async () => {
    try {
        const response = await refetchBusqueda({ Rut });
        console.log("responde", response)
        if (response && response.data && response.data.buscarPacientePorRut) {
            setPaciente(response.data.buscarPacientePorRut);
            setMensajeResultado("Rut encontrado");
        } else {
            setMensajeResultado("No se encontró el paciente con el Rut proporcionado.");
        }
    } catch (err) {
        console.log(err);
        if (err.graphQLErrors && err.graphQLErrors.length > 0) {
            setMensajeResultado(err.graphQLErrors[0].message);
        } else {
            setMensajeResultado("Ocurrió un error desconocido. Inténtelo de nuevo.");
        }
    } finally {
        setIsButtonDisabled(false); 
    }
  };

  const handleMostrarFormularioEspecialidad = () => {
    buscarEspecialistas();
    setMostrarFormularioEspecialidad(true);
    console.log("mostrarFormularioEspecialidad:", mostrarFormularioEspecialidad);
    
    const especialidadesUnicas = [...new Set(getEspecialistas.getEspecialistas.map(especialista => especialista.cargo))];
    setEspecialidades(especialidadesUnicas);
  };

  const buscarEspecialistas = () => {
    console.log("Buscando especialistas...");
    
    const especialistasFiltered = getEspecialistas.getEspecialistas.filter(
      (e) => e.cargo === selectedEspecialidad
    );
    setFilteredEspecialistas(especialistasFiltered);
    console.log("Especialistas filtrados:", especialistasFiltered);
    setEventosCalendario(transformarCitasParaCalendario(getCitas.getCitas, selectedEspecialidad));

    setHasSearched(true);
  };

  //const [FechaValida, setFechaValida] = useState([])
  //const [HoraValida, setHoraValida] = useState([])
  const handleBuscarPaciente = async () => {
    try {
      // Limpiar los estados antes de la nueva búsqueda
      setFechaValida([]);
      setHoraValida([]);
  
      const response = await refetchBusqueda({ Rut: rutPaciente });
  
      if (response && response.data && response.data.buscarPacientePorRut) {
        const pacienteEncontrado = response.data.buscarPacientePorRut;
  
        setPacienteId(pacienteEncontrado.id);
        setMensaje("Paciente encontrado");
        setPaciente(pacienteEncontrado);
        setBotonValidacion(true);
  
        const especialista = getEspecialistas?.getEspecialistas.find((e) => e.id === especialistaId);
  
        if (especialista) {
          const horariosEspecialista = especialista.horarios || [];
          const fechasDisponibles = especialista.horarios.map((horario) => horario.fecha) || [];
          setFechasDisponibles(fechasDisponibles);
  
          if (datosCita.fecha && especialista) {
            const horariosFechaSeleccionada = especialista.horarios.filter((horario) => horario.fecha === datosCita.fecha);
            const horasDisponibles = horariosFechaSeleccionada.map((horario) => horario.hora);
            setHorasDisponibles(horasDisponibles);
          }
  
          const horariosTotal = especialistaData ? especialistaData.getEspecialista : null;
          const horariosCita = getCitas.getCitas;

          console.log("HORARIOTOTAL", horariosTotal)
          console.log("HORARIOCITA", horariosCita)

          horariosCita.forEach((horario) =>{console.log("FECHAAAAAA",horario.fecha)})
          
          
  
          horariosEspecialista.forEach((horarioEspecialista) =>{
            const citaExistente = horariosCita.find(
              (horarioCita)=>
                horarioCita.especialista.Rut === horariosTotal.Rut &&
                horarioCita.fecha === horariosTotal.fecha &&
                horarioCita.hora === horariosTotal.hora
            );

            if (!citaExistente){
              setFechaValida((prev) => [...prev, horarioEspecialista.fecha]);
              setHoraValida((prev) => [...prev, horarioEspecialista.hora]);
            }
          }); 
            
          
        } else {
          setPaciente(null);
          setFechasDisponibles([]);
          setHorasDisponibles([]);
        }
      } else {
        setMensaje("Paciente no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar paciente:", error);
    }
  };
  
  

  
  

  /*const actualizarHorasDisponibles = (nuevaFecha) => {
    const especialista = getEspecialistas?.getEspecialistas.find((e) => e.id === especialistaId);
  
    if (especialista) {
      
      const horariosFechaSeleccionada = especialista.horarios
        .filter((horario) => horario.fecha === nuevaFecha);
  
      
      const horasDisponibles = horariosFechaSeleccionada.map((horario) => horario.hora);
      
      setHorasDisponibles(horasDisponibles);
    } else {
      
      setHorasDisponibles([]);
    }
  };*/

  const actualizarHorasDisponibles = (fechaSeleccionada) => {
    const especialista = getEspecialistas?.getEspecialistas.find((e) => e.id === especialistaId);
  
    if (especialista) {
      
      const horariosFechaSeleccionada = especialista.horarios
        .filter((horario) => horario.fecha === fechaSeleccionada);
  
      
      const horasDisponibles = horariosFechaSeleccionada.map((horario) => horario.hora);
      
      setHorasDisponibles(horasDisponibles);
    } else {
      
      setHorasDisponibles([]);
    }
  };

  const ValidarRut = (Entrada) => {
    const ValorLimpioInput = Entrada.replace(/[^\d-]/g, '');
  
    if (
      /^[0-9]{8,9}-[0-9]$/.test(ValorLimpioInput) ||
      /^[0-9]{7,8}-[0-9]$/.test(ValorLimpioInput)
    ) {
      setRutPaciente(ValorLimpioInput);
    } else {
      setRutPaciente(Entrada); 

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
      <div className='container'>
          <React.Fragment>
            <div className="mt-3">
              <h3>Selecciona una especialidad:</h3>
              <select
                className="form-control"
                value={selectedEspecialidad}
                onChange={(e) => setSelectedEspecialidad(e.target.value)}
              >
                <option value="">Selecciona una especialidad</option>
                {getEspecialistas && [...new Set(getEspecialistas.getEspecialistas.map((especialista) => especialista.cargo))].map((cargo) => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  ))}
              </select>
              <button className="btn btn-primary mt-2" onClick={handleMostrarFormularioEspecialidad}>
                Buscar
              </button>
            </div>
            {mostrarFormularioEspecialidad && (
              <div className="row mt-3">
                <h3>Especialistas con la especialidad seleccionada:</h3>
                <br/>
                {console.log("Especialistas filtrados:", especialistasFiltered)}
                {hassearch ? (
                  especialistasFiltered.length > 0 ? (
                    especialistasFiltered.map((especialista) => (
                      <div key={especialista.id}>
                        <h4>{`${especialista.nombre} ${especialista.apellido}`}</h4>
                        <p>Cargo: {especialista.cargo}</p>
                        <p>Estado: {especialista.estado}</p>
                        <p>Rut: {especialista.Rut}</p>
                        {/* Mostrar el calendario del especialista */}
                        {console.log("Eventos para el calendario:", transformarCitasParaCalendario(
                          getCitas.getCitas.filter((cita) => cita.especialista.id === especialista.id)
                        ))}
                        
                        <Calendar
                          localizer={localizer}
                          events={transformarCitasParaCalendario(
                            getCitas.getCitas.filter((cita) => 
                            cita.especialista.Rut === especialista.Rut),
                            especialista.cargo,               
                          )}     
                          startAccessor="start"
                          endAccessor="end"
                          style={{ height: 400 }}
                          eventPropGetter={eventStyleGetter}
                          onSelectEvent={handleSelectEvent}
                          
                        />
                        
                      </div>
                    ))
                  ) : (
                    <p>No hay especialistas disponibles con la especialidad seleccionada.</p>
                  )
                ) : (
                  <p>Realiza una búsqueda para ver los especialistas.</p>
                )}
              </div>
            )}
          </React.Fragment>
      </div>
      <br/>
      <div className='container mt-5'>
        <div className='row justify-content-center'>
          <div className="col-md-6">
            <h4>Agregar citas: </h4>
            <div className="card p-4 shadow">
              <form onSubmit={handleAgregarCita}>
                <div className='mb-3'>
                  <label className='form-label'>Cargo: </label>
                  <select
                    className='form-control'
                    value={selectedCargo}
                    onChange={(e) => handleSelectCargo(e.target.value)}
                  >
                    <option value=''>Selecciona un cargo</option>
                    {getEspecialistas && [...new Set(getEspecialistas.getEspecialistas.map((especialista) => especialista.cargo))].map((cargo) => (
                      <option key={cargo} value={cargo}>
                        {cargo}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCargo && (
                  <div>
                    <div className='mb-3'>
                      <label className='form-label'>Especialista: </label>
                      <select
                        className='form-control'
                        value={especialistaId}
                        onChange={(e) => setEspecialistaId(e.target.value)}
                      >
                        <option value=''>Selecciona un especialista</option>
                        {getEspecialistas && getEspecialistas.getEspecialistas.map((especialista) => (
                          (especialista.cargo === selectedCargo) &&
                          <option key={especialista.id} value={especialista.id}>
                            {`${especialista.nombre} ${especialista.apellido}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    {especialistaId && (
                      <div>
                        <div className='mb-3'>
                          <label className='form-label'>Rut del paciente: </label>
                          <input
                            type='text'
                            className='form-control'
                            value={rutPaciente}
                            onChange={handleChangeRut}
                          />
                        </div>
                        {console.log(BotonValidacion)}
                        <button className='btn btn-primary' onClick={handleBuscarPaciente} type='button'>Buscar Paciente</button>
                        {mensaje && <p>{mensaje}</p>}
                        {paciente && BotonValidacion && (
                          <div>
                            <div className='mb-3'>
                              <label className='form-label'>Fecha: </label>
                              <select
                                className='form-control'
                                value={datosCita.fecha}
                                onChange={(e) => {
                                  const nuevaFecha = e.target.value;
                                  setDatosCita((prev) => ({ ...prev, fecha: nuevaFecha }));
                                  actualizarHorasDisponibles(nuevaFecha);
                                }}
                              >
                                <option value=''>Selecciona una fecha</option>
                                {console.log(FechaValida)}
                                {FechaValida.map((fecha) => (
                                  <option key={fecha} value={fecha}>
                                   {new Date(Number(fecha)).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className='mb-3'>
                              <label className='form-label'>Hora: </label>
                              <select
                                className='form-control'
                                value={datosCita.hora}
                                onChange={(e) => setDatosCita((prev) => ({ ...prev, hora: e.target.value }))}
                              >
                                <option value=''>Selecciona una hora</option>
                                {horasDisponibles.map((hora) => (
                                  <option key={hora} value={hora}>
                                    {hora}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button className='btn btn-primary' type='submit'>Crear cita</button>
                            {MensajeAgendado && <p>{MensajeAgendado}</p>}
                          </div>
                        )}
                      </div>
                    )}
                    
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}





