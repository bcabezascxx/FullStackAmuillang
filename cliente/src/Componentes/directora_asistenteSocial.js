import { useQuery, gql, useMutation } from "@apollo/client";
import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Nav from "./nav";
import {validateRut} from "rutlib"


const GET_AsistenteSocial = gql`
    query{
        getAsistenteSociales{
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

const ADD_AsistenteSocial = gql`
    mutation addAsistenteSocial($input: AsistenteSocialInput){
        addAsistenteSocial(input:$input){
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

const DELETE_AsistenteSocial=gql`
mutation deleteAsistenteSocial($id: ID!){
    deleteAsistenteSocial(id:$id){
        message
        
    }
}
`;

const UPDATE_AsistenteSocial_ESTADO = gql`
  mutation UpdateAsistenteSocialEstado($id: ID!, $estado: String!) {
    UpdateAsistenteSocialEstado(id: $id, estado: $estado) {
      id
      estado
    }
  }
`;

const UPDATE_PASS_SECRETARIA = gql`
  mutation UpdateAsistenteSocialPassword($id: ID!, $pass: String){
    UpdateAsistenteSocialPassword(id: $id, pass: $pass){
        id
        pass
    }
  }
`


const UPDATE_EMAIL = gql`
  mutation UpdateAsistenteSocialEmail($id: ID!, $email: String){
    UpdateAsistenteSocialEmail(id:$id , email: $email){
        id
        email
    }
  }
`



export default function Directora_asistenteSocial(){
    const {loading, error, data,refetch} = useQuery(GET_AsistenteSocial)
    const [addAsistenteSocial, {dataadd, loadingadd,erroradd}] = useMutation(ADD_AsistenteSocial);
    const [deleteAsistenteSocial, {dataDelete, loadingDelete,errorDelete}] = useMutation(DELETE_AsistenteSocial);
    const [updateAsistenteSocialEstado] = useMutation(UPDATE_AsistenteSocial_ESTADO);
    const [UpdateAsistenteSocialPassword] = useMutation(UPDATE_PASS_SECRETARIA);
    const [UpdateAsistenteSocialEmail] = useMutation(UPDATE_EMAIL);

    const [rut, setRut]= useState('');
    const [nombre, setNombre]= useState('');
    const [apellido, setApellido]= useState('');
    const [cargo, setCargo]= useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass]= useState('');
    const [estado, setEstado] = useState("habilitado");


    const [show, setShow] = useState(false);

    

    const [selectedAsistenteSocial, setSelectedAsistenteSocial] = useState(null)
    const [newPass, setNewPass] = useState('');
    const [NewEmail, setNewEmail] = useState('');
    const [messageEmail, setMessageEmail] = useState('')
    const [messagePassword, setMessagePasword] = useState('')

    const handleClose = () => setShow(false);
    const handleShow = (asistenteSocial) => {
        setSelectedAsistenteSocial(asistenteSocial)
        setShow(true)};

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addAsistenteSocial({
              variables: {
                  input: {
                      Rut: rut,
                      pass: pass,
                      nombre: nombre,
                      apellido: apellido,
                      email: email,
                      cargo: "Asistente Social",
                      estado: estado
                  }
              },
              refetchQueries: [{ query: GET_AsistenteSocial }]
          });    
        } catch (error) {
            console.error("Error al agregar el cargo Asistente Social:", error.message);
        }
        
        setRut('');
        setNombre('');
        setApellido('');
        setCargo('');
        setPass('');
        setEmail('');
        setEstado("habilitado");
      };

    const handleUpdateEmail = async(AsistenteSocialId) =>{
        try{
    
            const {data} = await UpdateAsistenteSocialEmail({
                variables: {
                    id: AsistenteSocialId,
                    email: NewEmail
                }
            })
    
            setMessageEmail('Email cambiado con éxito');
    
    
        }catch(error){
            console.log("error al cambiar el email", error)
    
        }
    
    };

    const handleUpdatePass = async (AsistenteSocialId) =>{
        try{
            const { data } = await UpdateAsistenteSocialPassword({
                variables: {
                    id: AsistenteSocialId,
                    pass: newPass
                },
            });
    
            console.log("Contraseña del Asistente Social actualizada");
    
            setMessagePasword('Contraseña cambiado con éxito');
    
            
    
        }catch(error){
            console.log("error update pass", error)
    
        }
    
    
    };


    const handleDeleteDirectly = async (asistenteSocialId) => {
        try {
            const { data } = await deleteAsistenteSocial({ variables: { id: asistenteSocialId } });
            console.log(data.deleteAsistenteSocial.message);  
            
            refetch();
        } catch (err) {
            console.error("Error al eliminar el cargo Asistente Social:", err.message);
        }
    };
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





    const handleChangeEstado = async (asistenteSocialId, desiredState) => {
        console.log("ID:", asistenteSocialId);
        console.log("Estado:", desiredState);
        console.log("data", data)
  
        try {
              const { data } = await updateAsistenteSocialEstado({
                
                variables: {
                    id: asistenteSocialId, 
                    estado: desiredState
                }
            });
            console.log(data);
            refetch(); 
        } catch (err) {
            console.error("Error al actualizar el estado:", err.message);
        }
      };

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

    

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar datos: {error.message}</p>
    return(
        <div>
            <div>
                <Nav />
            </div>
            <div>
                <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false} dialogClassName="custom-modal">
                    <Modal.Header closeButton>
                    <Modal.Title>Información</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>{selectedAsistenteSocial  && selectedAsistenteSocial.nombre} {selectedAsistenteSocial  && selectedAsistenteSocial.apellido}</h4>
                        {/*<p>Email: {selectedEspecialista.email}</p>*/}
                        <p>Cargo: {selectedAsistenteSocial  && selectedAsistenteSocial.cargo}</p>
                        <p>Contraseña: {selectedAsistenteSocial  && selectedAsistenteSocial.pass}</p>

                        <h4>Cambiar contraseña</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            selectedAsistenteSocial && handleUpdatePass( selectedAsistenteSocial.id);}}>

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
                            selectedAsistenteSocial && handleUpdateEmail(selectedAsistenteSocial.id);
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
                <h2>Cargos Asistente Social: </h2>
                <div className="row">
                    {data.getAsistenteSociales.map(asis=>(
                        <div className="col-md-4" key={asis.id}>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">{asis.nombre}  {asis.apellido}</h5>
                                    <p className="card-text">RUT: {asis.Rut}</p>
                                    <p className='card-text'>PASS: {asis.pass}</p>
                                    <p className='card-text'>Cargo: {asis.cargo}</p>
                                    <p className="card-text">Email: {asis.email}</p>
                                    <h4 className='card-text' style={{ color: asis.estado === "habilitado" ? 'green' : 'red' }}>
                                    {asis.estado}
                                    </h4>
                                </div>
                                <button className='btn btn-light'  style={{ margin: "10px 20px" }} onClick={() => handleShow(asis)}><span style={{ color: "Blue"}}>Más información</span></button>
                                <button className='btn btn-light' onClick={() => handleDeleteDirectly(asis.id)}><span style={{color:"Red"}}>Eliminar</span></button> 
                                <div className='container col-12 w-100 px-2'>
                                    <button type="button" className="btn btn-success col-6 ml-2" onClick={() => handleChangeEstado(asis.id, "habilitado")}>Habilitar</button>
                                    <button type="button" className='btn btn-danger col-6' onClick={() => handleChangeEstado(asis.id, "deshabilitado")}>Deshabilitar</button>
                                </div>
                            </div> 
                        </div>
                    ))}

                </div>
            </div>
            <div>
                <h2>Agregar asistente social</h2>
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
                                        <input type="text" className="form-control" value="Asistente Social" readOnly />
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

                                        <button type="submit" className="btn btn-primary">Guardar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

        </div>
    )
}