import React, { useState , useEffect} from 'react';
import { useMutation, useQuery , gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import Nav from './nav'
import { useLocation } from 'react-router-dom';
import moment from "moment"


const CREAR_FICHA_MEDICA = gql`
    mutation crearFichaMedica($input: FichaMedicaInput!) {
        crearFichaMedica(input: $input) {
            Paciente {
                id
                Rut
                nombre
                apellido
            }
            fechaCreacion
        }
    }
`;

const OBTENER_PACIENTE_POR_ID = gql`
    query obtenerPacientePorId($id: ID!) {
        obtenerPacientePorId(id: $id) {
            id
            Rut
            nombre
            apellido
            tieneFichaMedica
            
        }
    }
`;



const OBTENER_FICHA_MEDICA = gql`
    query obtenerFichaMedicaPorPaciente($pacienteId: ID!) {
        obtenerFichaMedicaPorPaciente(PacienteId: $pacienteId) {
        id
        Paciente {
            Rut
            nombre
            apellido
        }
        fechaCreacion
        observaciones{
            id
            especialista{
                nombre
                apellido
                cargo
            }
            fecha
            diagnostico
            notas
            recomendaciones
            asistencia
            justificacion

        }
        historialMedico{
            diagnosticoAnterior
            EnfermedadAnterior
        }
        }
    }
  
`;


const AGREGAR_OBSERVACIONES = gql`
  mutation agregarObservacion($pacienteId: ID!, $input: ObservacionInput!) {
    agregarObservacion(pacienteId: $pacienteId, input: $input) {
      id
      fecha
      especialista {
        nombre
        apellido
        cargo
      }
      diagnostico
      notas
      recomendaciones
      asistencia
      justificacion
    }
  }
`;



const GET_ESPECIALISTAS=gql`
    query getEspecialistas{
        getEspecialistas{
            id
            nombre
            apellido
            cargo
        }
    }
`

const  ACTUALIZAR_OBSERVACION=gql`
    mutation actualizarObservaciones($idObservacion:ID!, $diagnostico:String!, $notas: String!, $recomendaciones: String!){
        actualizarObservaciones(idObservacion:$idObservacion, diagnostico:$diagnostico, notas: $notas, recomendaciones: $recomendaciones){
            diagnostico
            notas
            recomendaciones
        }
    }


`




export default function FichaMedica() {
    const { pacienteId } = useParams();
    const pacienteIdString = pacienteId.toString(); 


    const [fichaMedica, setFichaMedica] = useState(null);

    const observacionesEditState = {};


    //Mutation y Queries
    const [crearFichaMedica] = useMutation(CREAR_FICHA_MEDICA);
    const {data: data1 ,error: error1, loading: loading1} = useQuery(OBTENER_PACIENTE_POR_ID, { variables: {id: pacienteIdString}})
    const {data: dataFichaMedica, error: errorFichaMedica, loading: loadingFichaMedica} = useQuery(OBTENER_FICHA_MEDICA, {variables: {pacienteId: pacienteIdString}})
    const [agregarObservacion] =  useMutation(AGREGAR_OBSERVACIONES);
    const {data: dataespecialistas, error: errorespecialistas, loading: loadingEspecialistas} =useQuery(GET_ESPECIALISTAS)
    const [actualizarObservaciones] = useMutation(ACTUALIZAR_OBSERVACION)
    

    const [ActivarCambiosObservacion, setActivarCambios] = useState(false)

    const [ObservacionesActual, setObservacionesActual] = useState(null)

    const [ObservacionNuevo , setObservacionNuevo] = useState({
        observacionId:'',
        recomendaciones : '',
        notas : '',
        diagnostico : ''
    })

    const [historialMedicoInput, setHistorialMedicoInput] = useState({
        diagnosticoAnterior:'',
        EnfermedadAnterior: ''
    })

    const [observacionesInput , setobservacionesInput] =useState({
        fecha: '',
        especialistaId:'',
        diagnostico:'',
        notas:'',
        recomendaciones:'',
        asistencia: true,
        justificacion: 'No indicado'


    })

    const [filterEspecialistaCargo, setfilterEspecialistaCargo] =useState({
        especialidad:''
    })

    const [mostrarJustificacion, setMostrarJustificacion] = useState(false);

    if (loading1 || loadingFichaMedica || loadingEspecialistas){
        return <p>Cargando...</p>
    }

    
    //console.log("FichaMedica: ",dataFichaMedica)
    //console.log("Id del paciente", pacienteIdString)
    //console.log("obtener paciente por id", data1)
    
    if (errorFichaMedica) {
        console.error("Error:",  errorFichaMedica);
        return <p>Error fetching data</p>;
    }



    const handleCrearFichaMedica = async() =>{
        try{

            if (!pacienteId || typeof pacienteId !== 'string' || !historialMedicoInput.diagnosticoAnterior || !historialMedicoInput.EnfermedadAnterior) {
  
                console.error('Datos para crear ficha médica incompletos o inválidos');
                return;
            } 

            //console.log("Tipo pacienteId", typeof(pacienteIdString))
            //console.log("Tipo diagnostico anterior", typeof(historialMedicoInput.diagnosticoAnterior))
            //console.log("Tipo Enfermedad anterior", typeof(historialMedicoInput.EnfermedadAnterior))

            const {data} = await crearFichaMedica({
                variables:{
                    input: {
                        PacienteId: pacienteIdString,
                        observaciones: [],
                        historialMedico: {
                            diagnosticoAnterior: historialMedicoInput.diagnosticoAnterior,
                            EnfermedadAnterior: historialMedicoInput.EnfermedadAnterior,
                        },

                    },
                },

            });
            
            console.log("Ficha médica creada")
 

            setFichaMedica(data.crearFichaMedica);
            window.location.reload()
            
        }catch(error){
            console.log("error al crear la ficha médica", error)

        }
    }

    let valor=0
    

    const handleActivarCambioObservacion = (observaciones)=>{
        valor=valor+1
        if (valor==1){
            setActivarCambios((prevActivarCambiosObservacion)=>(!prevActivarCambiosObservacion));
            console.log("IIIIIID",observaciones)
            setObservacionNuevo({
            observacionId: observaciones.id,
            recomendaciones:observaciones.recomendaciones,
            diagnostico:observaciones.diagnostico,
            notas: observaciones.notas});

        }else
        return
    }
    

    
    const handleActualizarObservacion = async(event) =>{
        try{

            console.log("DATOS",
                ObservacionNuevo.observacionId,
                ObservacionNuevo.recomendaciones,
                ObservacionNuevo.notas,
                ObservacionNuevo.diagnostico

            )
            const {data} = await actualizarObservaciones({
                variables: {
                    idObservacion: ObservacionNuevo.observacionId,
                    recomendaciones:ObservacionNuevo.recomendaciones,
                    notas: ObservacionNuevo.notas,
                    diagnostico: ObservacionNuevo.diagnostico
                }
            })
            

            console.log("Observación actualizada")
            //window.location.reload()

        } catch(error){
            console.log("Error al actualizar la observación")
        }
        
    }

    const handleAgregarObservacion = async(event)  =>{
        try{
            console.log("datos: ", 
                observacionesInput.fecha,
                observacionesInput.especialistaId,
                observacionesInput.diagnostico,
                observacionesInput.notas,
                observacionesInput.recomendaciones,
                observacionesInput.asistencia,
                observacionesInput.justificacion)

            const {data} = await agregarObservacion({
                
                variables : {
                    pacienteId: pacienteId,

                    input: {
                        fecha: observacionesInput.fecha,
                        especialistaId: observacionesInput.especialistaId, //falta
                        diagnostico: observacionesInput.diagnostico,
                        notas: observacionesInput.notas,
                        recomendaciones: observacionesInput.recomendaciones,
                        asistencia: observacionesInput.asistencia,
                        justificacion: observacionesInput.justificacion
                    }
                }
            });
            
            console.log("Observación agregada a la data", data)

            window.location.reload()

        }catch(error){
            console.log("error al agregar la observación", error)

        }
    }

    


    const paciente = data1 ? data1.obtenerPacientePorId : null
    const FichaMedica = dataFichaMedica ? dataFichaMedica.obtenerFichaMedicaPorPaciente : null
    console.log(FichaMedica)
    

    //console.log("FichaMedica: ", FichaMedica)
    //console.log("ObtenerPacientePorId", paciente && paciente.tieneFichaMedica)


    return(
        <div>
            <Nav/>
            {paciente && FichaMedica && paciente.tieneFichaMedica ? (
                <div>
                    <h1 className='text-center'><strong>Ficha médica</strong></h1>
                    <br/>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='table-responsive'>
                                    <table className="table table-hover mx-auto">
                                        <tbody className='text-center'>
                                            <tr>
                                                <th scope='col' className='col-sm-3 m-2'><p><strong><u>Rut del paciente: </u></strong></p></th>
                                                <td className='col-sm-9'>{FichaMedica && FichaMedica.Paciente.Rut}</td>
                                            </tr>
                                            <tr>
                                                <th scope='col' className='col-sm-3 m-2'><p><strong><u>Nombre y apellido del paciente: </u></strong></p></th>
                                                <td className='col-sm-9'>{FichaMedica && FichaMedica.Paciente.nombre} {FichaMedica && FichaMedica.Paciente.apellido}</td>
                                            </tr>
                                            <tr>
                                                <th scope='col' className='col-sm-3 m-2'><p><strong><u>Fecha de creación: </u></strong></p></th>
                                                    {FichaMedica && FichaMedica.fechaCreacion &&(
                                                        <td className='col-sm-9'>{moment(Number(FichaMedica.fechaCreacion)).format("DD-MM-YYYY")}</td>
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className='text-center'>Historial médico anterior</h2>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='table-responsive'>
                                    <table className="table table-hover  mx-auto">
                                        <tbody className='text-center'>
                                            <tr>
                                                <th scope='col' className='col-sm-3'><strong><u>Diagnóstico anterior:</u></strong> </th>
                                                <td className='col-sm-9'>{FichaMedica && FichaMedica.historialMedico[0].diagnosticoAnterior}</td>

                                            </tr>
                                            <tr>
                                                <th scope='col' className='col-sm-3'><strong><u>Enfermedad anterior:</u></strong></th>
                                                <td className='col-sm-9'>{FichaMedica && FichaMedica.historialMedico[0].EnfermedadAnterior}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>    
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <br/>
                    <h2 className='text-center'><strong><u>Observaciones</u></strong></h2>
                    <div className="container mt-5">
                        <div className="row justify-content-center">
                            {FichaMedica ? FichaMedica.observaciones.map((observaciones, index) =>(
                                <div className="mb-3" key={index}>
                                    <div className="card">
                                        <h4 className="card-title text-center"><strong>Fecha: </strong> {moment(Number(observaciones.fecha)).format("DD-MM-YYYY")}</h4>
                                        <div className="card-body">
                                            <p className="card-text">Nombre y apellido del especialista: {observaciones.especialista ? `${observaciones.especialista.nombre} ${observaciones.especialista.apellido}` : 'Especialista Desconocido'}</p>
                                            <p className="card-text">Cargo del especialista: {observaciones.especialista ? (observaciones.especialista.cargo ? `${observaciones.especialista.cargo}` : 'Cargo desconocido') : 'Especialista Desconocido'}</p>
                                            <p className="card-text">Diagnostico: {observaciones.diagnostico}</p>
                                            <p className="card-text">Notas: {observaciones.notas}</p>
                                            <p className="card-text">Recomendaciones: {observaciones.recomendaciones}</p>
                                            <p className="card-text">Asistencia: {observaciones.asistencia ? "Asistio" : "No asistio"}</p>
                                            {observaciones.asistencia ? "" : <p className="card-text">Justificación de asistencia: {observaciones.justificacion}</p>}
                                            

                                            
                                        </div>

                                    </div>

                                </div>
                            )):null}
                        </div>

                    </div>
                </div>
            ): (
                <div className="container">
                    <h4>No se encontró información de la ficha médica para el paciente con rut:  {paciente.Rut}</h4>
                    <form>
                        <div className="col-md-6 mb-3">
                            <label>Diagnóstico anterior: </label>
                            <textarea className="form-control" type="text" value={historialMedicoInput.diagnosticoAnterior} onChange={e => setHistorialMedicoInput(prev => ({...prev, diagnosticoAnterior: e.target.value}))} required/>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Enfermedad anterior: </label>
                            <textarea className="form-control" type="text" value={historialMedicoInput.EnfermedadAnterior} onChange={e => setHistorialMedicoInput(prev => ({...prev, EnfermedadAnterior: e.target.value}))} required/>
                        </div>            
                    </form>
                    <button className="btn btn-primary" onClick={handleCrearFichaMedica}>Crear ficha médica</button>
                </div>
            )}
        </div>
    );
}