import React, {useState, useEffect} from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Nav from "./nav"
import "./directora.css"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import {validateRut} from "rutlib"





const GET_ESPECIALISTAS = gql`
  query {
    getEspecialistas {
      id
      Rut
      pass
      nombre
      apellido
      email
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
`;


const ADD_ESPECIALISTA=gql`
mutation AddEspecialista($input: EspecialistaInput){
    addEspecialista(input:$input){
        id
        Rut
        pass
        nombre
        apellido
        email
        cargo
        estado
        
    }
}
`;



const DELETE_ESPECIALISTA=gql`
mutation deleteEspecialista($id: ID!){
    deleteEspecialista(id:$id){
        message
        
    }
}
`;

const UPDATE_ESPECIALISTA_ESTADO = gql`
  mutation UpdateEspecialistaEstado($id: ID!, $estado: String!) {
    UpdateEspecialistaEstado(id: $id, estado: $estado) {
      id
      estado
    }
  }
`;


const UPDATE_PASS_ESPECIALISTA = gql`
  mutation UpdateEspecialistaPassword($id: ID!, $pass: String){
    UpdateEspecialistaPassword(id: $id, pass: $pass){
        id
        pass
    }
  }
`


const UPDATE_EMAIL = gql`
  mutation UpdateEspecialistaEmail($id: ID!, $email: String){
    UpdateEspecialistaEmail(id:$id , email: $email){
        id
        email
    }
  }
`


export default function Especialista() {
  const {state} = useLocation();
  const directoraId = state?.directoraId || sessionStorage.getItem('directoraId')
  const [fichaMedica, setFichaMedica] = useState(null);

  const navigate= useNavigate();

  if(directoraId===null){
    navigate("/")
  }

  console.log("DirectoraId", directoraId)

  const { loading, error, data , refetch} = useQuery(GET_ESPECIALISTAS);
  const [addEspecialista, {dataadd, loadingadd,erroradd}] = useMutation(ADD_ESPECIALISTA);
  const [deleteEspecialista, {dataDelete, loadingDelete,errorDelete}] = useMutation(DELETE_ESPECIALISTA);
  const [updateEspecialistaEstado] = useMutation(UPDATE_ESPECIALISTA_ESTADO);
  const [UpdateEspecialistaPassword] = useMutation(UPDATE_PASS_ESPECIALISTA);
  const [UpdateEspecialistaEmail] = useMutation(UPDATE_EMAIL);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (especialista) => {
    setSelectedEspecialista(especialista)
    setShow(true)};

  const [selectedEspecialista, setSelectedEspecialista] = useState(null)
  const [newPass, setNewPass] = useState('');
  const [NewEmail, setNewEmail] = useState('');
  const [messageEmail, setMessageEmail] = useState('')
  const [messagePassword, setMessagePasword] = useState('')

  const [id, setId] = useState('');
  const [horarios, setHorarios] = useState([{ fecha: '', hora: '' }]);

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

  const agregarHorarios = () => {
    const nuevosHorarios = [];
    for (let i = 0; i < numHorarios; i++) {
        nuevosHorarios.push({ fecha: '', hora: '' });
    }
    setHorarios(nuevosHorarios);
  };

  const [numHorarios, setNumHorarios] = useState(1);  


  const [rut, setRut]= useState('');
  const [nombre, setNombre]= useState('');
  const [apellido, setApellido]= useState('');
  const [cargo, setCargo]= useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass]= useState('');
  const [estado, setEstado] = useState("habilitado");


  const handleUpdateEmail = async(especialistaId) =>{
    try{

        const {data} = await UpdateEspecialistaEmail({
            variables: {
                id: especialistaId,
                email: NewEmail
            }
        })

        setMessageEmail('Email cambiado con éxito');


    }catch(error){
        console.log("error al cambiar el email", error)

    }

  };


  const handleUpdatePass = async (especialistaId) =>{
    try{
        const { data } = await UpdateEspecialistaPassword({
            variables: {
                id: especialistaId,
                pass: newPass
            },
        });

        console.log("Contraseña del especialista actualizada");

        setMessagePasword('Contraseña cambiado con éxito');

        

    }catch(error){
        console.log("error update pass", error)

    }


  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if(numHorarios===0){
        alert("Por favor, selecciona al menos 1 horario. ");
        return;
    }
    try {
        await addEspecialista({
          variables: {
              input: {
                  Rut: rut,
                  pass: pass,
                  nombre: nombre,
                  apellido: apellido,
                  cargo: cargo,
                  email: email,
                  estado: estado,
                  horarios: horarios
              }
          },
          refetchQueries: [{ query: GET_ESPECIALISTAS }]
      });    
    } catch (error) {
        console.error("Error al agregar el especialista:", error.message);
    }
    
    setRut('');
    setNombre('');
    setApellido('');
    setCargo('');
    setPass('');
    setEmail('');
    setEstado("habilitado");
    setHorarios([{ fecha: '', hora: '' }]);
    setNumHorarios(1);
  };
  
  useEffect(() => {
    const newHorarios = [];
    for (let i = 0; i < numHorarios; i++) {
        newHorarios.push({ fecha: '', hora: '' });
    }
    setHorarios(newHorarios);
}, [numHorarios]);



    const handleDeleteDirectly = async (especialistaId) => {
      try {
          const { data } = await deleteEspecialista({ variables: { id: especialistaId } });
          console.log(data.deleteEspecialista.message);  
          refetch();
      } catch (err) {
          console.error("Error al eliminar el especialista:", err.message);
      }
  };
  



    const handleChangeEstado = async (especialistaId, desiredState) => {
      console.log("ID:", especialistaId);
      console.log("Estado:", desiredState);
      console.log("data", data)

      try {
            const { data } = await updateEspecialistaEstado({
              
              variables: {
                  id: especialistaId, 
                  estado: desiredState
              }
          });
          console.log(data);
          refetch(); 
      } catch (err) {
          console.error("Error al actualizar el estado:", err.message);
      }
    };

  
    function formatDate(timestamp) {
      const date = new Date(Number(timestamp));
      const today = new Date();
  
      
      if (date.setHours(0,0,0,0) < today.setHours(0,0,0,0)) {
          return null;
      }
  
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = date.getFullYear();
  
      return `${day}-${month}-${year}`;
    }
  

  if (loading) return <p>Cargando especialistas...</p>;
  if (loadingadd) return <p>Guardando...</p>;
  if (erroradd) return <p>Error al guardar especialistas: {error.message}</p>;
  if (error) return <p>Error al cargar especialistas: {error.message}</p>;

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
        <Nav/>
      </div>

      <div>
        <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false} dialogClassName="custom-modal">
            <Modal.Header closeButton>
            <Modal.Title>Información</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{selectedEspecialista  && selectedEspecialista.nombre} {selectedEspecialista  && selectedEspecialista.apellido}</h4>
                {/*<p>Email: {selectedEspecialista.email}</p>*/}
                <p>Cargo: {selectedEspecialista  && selectedEspecialista.cargo}</p>
                <p>Contraseña: {selectedEspecialista  && selectedEspecialista.pass}</p>

                <h4>Cambiar contraseña</h4>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    selectedEspecialista && handleUpdatePass( selectedEspecialista.id);}}>

                    <div className="mb-3">
                        <label className="form-label">Nueva Contraseña:</label> 
                        <textarea className='form-control' value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-danger">Cambiar Contraseña</button>
                    {messagePassword && <p>{messagePassword}</p>}
                    
                </form>

                <br />
                <h4>Cambiar correo</h4>
                <form onSubmit={(e =>{
                    e.preventDefault();
                    selectedEspecialista && handleUpdateEmail(selectedEspecialista.id);
                })}>
                    <div className='mb-3'>
                        <label className='form-label'>Correo electrónico nuevo</label>
                        <textarea className='form-control' value={NewEmail} onChange={(e)=> setNewEmail(e.target.value)}></textarea>
                    </div>
                    <button className='btn btn-primary' type='submit'>Cambiar correo electrónico</button>
                    {messageEmail && <p>{messageEmail}</p>}
                </form>

            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
      </div>

      <div>
            <h2>Especialistas</h2>
            <div className="row">
                {data.getEspecialistas.map((esp,index) => (
                    <div className="col-md-4" key={esp.id}>
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{esp.nombre}  {esp.apellido}</h5>
                                <p className="card-text">RUT: {esp.Rut}</p>
                                <p className='card-text'>PASS: {esp.pass}</p>
                                <p className='card-text'>Cargo: {esp.cargo}</p>
                                <p className='card-text'>Email: {esp.email}</p>
                                <h4 className='card-text' style={{ color: esp.estado === "habilitado" ? 'green' : 'red' }}>
                                    {esp.estado}
                                </h4>
                                
                                <div className="card-text">
                                    Horarios:
                                    <ul>
                                    {esp.horarios.map((horario, index) => {
                                        //const formattedDate = formatDate(horario.fecha);
                                        const fechaFormateada = new Date(Number(horario.fecha)).toLocaleDateString('es-CL', { timeZone: 'UTC' });


                                        if (!fechaFormateada) return null; 

                                        return (
                                            <li key={index}>
                                                {fechaFormateada} - {horario.hora}
                                            </li>
                                        );
                                    })}
                                    </ul>
                                </div>
                                
                            </div>
                            <button className='btn btn-light'  style={{ margin: "10px 20px" }} onClick={() => handleShow(esp)}><span style={{ color: "Blue"}} >Más información</span></button>
                            <button className='btn btn-light' onClick={() => handleDeleteDirectly(esp.id)}><span style={{color:"Red"}}>Eliminar</span></button> 
                            <div className='container col-12 w-100 px-2'>
                              <button type="button" className="btn btn-success col-6 ml-2" onClick={() => handleChangeEstado(esp.id, "habilitado")}>Habilitar</button>
                              <button type="button" className='btn btn-danger col-6' onClick={() => handleChangeEstado(esp.id, "deshabilitado")}>Deshabilitar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
              <hr/>
            </div>
            
        </div>
        <h2>Agregar especialista</h2>
        <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card p-4 shadow">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">RUT:</label>
                            <input type="text" className="form-control" value={rut} onChange={ (e) => { setRut(e.target.value); handleChange(e)}} required/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nombre:</label>
                            <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Apellido:</label>
                            <input type="text" className="form-control" value={apellido} onChange={(e) => setApellido(e.target.value)} required/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Cargo:</label>
                            <select className="form-control" value={cargo} onChange={(e) => setCargo(e.target.value)} required>
                                <option value="">Selecciona un cargo</option>
                                <option value="Kinesiologo">Kinesiólogo</option>
                                <option value="Nutricionista">Nutricionista</option>
                                <option value="Psicologo">Psicologo</option>
                                <option value="Fonoaudiologia">Fonoaudiologia</option>
                                
                            </select>
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>Email: </label>
                            <input type='text' className='form-control' value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                        </div>

                        <div className="mb-3 form-check">
                            <input 
                                type="checkbox" 
                                className="form-check-input" 
                                checked={estado === 'habilitado'}  
                                onChange={() => setEstado(estado === 'habilitado' ? 'deshabilitado' : 'habilitado')}
                            />
                            <label className="form-check-label">
                                Estado: {estado}
                            </label>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña:</label>
                            <input type="text" className="form-control" value={pass} onChange={(e) => setPass(e.target.value)} required/>
                        </div>


                        <div className="mb-3">
                                <label className="form-label">Número de horarios a donar:</label>
                                <select 
                                    value={numHorarios} 
                                    onChange={(e) => setNumHorarios(e.target.value)}
                                    className="form-control"
                                    required>
                                    {[...Array(10).keys()].map(i => 
                                        <option key={i} value={i + 1}>{i + 1}</option>
                                    )}
                                </select>
                            </div>

                            {horarios.map((horario, index) => (
                                <div key={index}>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha de horario {index + 1}:</label>
                                        <input 
                                            type="date" 
                                            className="form-control" 
                                            value={horario.fecha ? horario.fecha.toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                const newHorarios = [...horarios];
                                                newHorarios[index].fecha = new Date(e.target.value);
                                                setHorarios(newHorarios);
                                            }}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Hora de horario {index + 1}:</label>
                                        <input 
                                            type="time" 
                                            className="form-control" 
                                            value={horario.hora} 
                                            onChange={(e) => {
                                                const newHorarios = [...horarios];
                                                newHorarios[index].hora = e.target.value;
                                                setHorarios(newHorarios);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}


                        <button type="submit" className="btn btn-primary">Guardar Especialista</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </div>
  );
}


