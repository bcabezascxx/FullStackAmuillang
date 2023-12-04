import { useQuery, gql, useMutation } from "@apollo/client";
import React, {useState, useEffect} from 'react';
import Nav from "./nav";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {validateRut} from "rutlib"



const GET_SECRETARIAS = gql`
    query{
        getSecretarias{
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

const ADD_SECRETARIAS = gql`
    mutation addSecretaria($input: SecretariaInput){
        addSecretaria(input:$input){
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

const DELETE_SECRETARIA=gql`
mutation deleteSecretaria($id: ID!){
    deleteSecretaria(id:$id){
        message
        
    }
}
`;

const UPDATE_SECRETARIA_ESTADO = gql`
  mutation UpdateSecretariaEstado($id: ID!, $estado: String!) {
    UpdateSecretariaEstado(id: $id, estado: $estado) {
      id
      estado
    }
  }
`;

const UPDATE_PASS_SECRETARIA = gql`
  mutation UpdateSecretariaPassword($id: ID!, $pass: String){
    UpdateSecretariaPassword(id: $id, pass: $pass){
        id
        pass
    }
  }
`


const UPDATE_EMAIL = gql`
  mutation UpdateSecretariaEmail($id: ID!, $email: String){
    UpdateSecretariaEmail(id:$id , email: $email){
        id
        email
    }
  }
`



export default function Directora_secretaria(){
    const {loading, error, data,refetch} = useQuery(GET_SECRETARIAS)
    const [addSecretaria, {dataadd, loadingadd,erroradd}] = useMutation(ADD_SECRETARIAS);
    const [deleteSecretaria, {dataDelete, loadingDelete,errorDelete}] = useMutation(DELETE_SECRETARIA);
    const [updateSecretariaEstado] = useMutation(UPDATE_SECRETARIA_ESTADO);
    const [UpdateSecretariaPassword] = useMutation(UPDATE_PASS_SECRETARIA);
    const [UpdateSecretariaEmail] = useMutation(UPDATE_EMAIL);

    const [rut, setRut]= useState('');
    const [nombre, setNombre]= useState('');
    const [apellido, setApellido]= useState('');
    const [cargo, setCargo]= useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass]= useState('');
    const [estado, setEstado] = useState("habilitado");


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



    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (secretaria) => {
        setSelectedSecretaria(secretaria)
        setShow(true)};

    const [selectedSecretaria, setSelectedSecretaria] = useState(null)
    const [newPass, setNewPass] = useState('');
    const [NewEmail, setNewEmail] = useState('');
    const [messageEmail, setMessageEmail] = useState('')
    const [messagePassword, setMessagePasword] = useState('')


    const handleUpdateEmail = async(secretariaId) =>{
        try{
    
            const {data} = await UpdateSecretariaEmail({
                variables: {
                    id: secretariaId,
                    email: NewEmail
                }
            })
    
            setMessageEmail('Email cambiado con éxito');
    
    
        }catch(error){
            console.log("error al cambiar el email", error)
    
        }
    
    };
    
    
    const handleUpdatePass = async (secretariaId) =>{
        try{
            const { data } = await UpdateSecretariaPassword({
                variables: {
                    id: secretariaId,
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
        try {
            await addSecretaria({
              variables: {
                  input: {
                      Rut: rut,
                      pass: pass,
                      nombre: nombre,
                      apellido: apellido,
                      email: email,
                      cargo: "Secretaria",
                      estado: estado
                  }
              },
              refetchQueries: [{ query: GET_SECRETARIAS }]
          });    
        } catch (error) {
            console.error("Error al agregar el cargo secretaria:", error.message);
        }
        
        setRut('');
        setNombre('');
        setApellido('');
        setCargo('');
        setPass('');
        setEmail('');
        setEstado("habilitado");
      };


    const handleDeleteDirectly = async (secretariaId) => {
        try {
            const { data } = await deleteSecretaria({ variables: { id: secretariaId } });
            console.log(data.deleteSecretaria.message);  
            refetch();
        } catch (err) {
            console.error("Error al eliminar el cargo secretaria:", err.message);
        }
    };


    const handleChangeEstado = async (secretariaId, desiredState) => {
        console.log("ID:", secretariaId);
        console.log("Estado:", desiredState);
        console.log("data", data)
  
        try {
              const { data } = await updateSecretariaEstado({
                
                variables: {
                    id: secretariaId, 
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
                        <h4>{selectedSecretaria  && selectedSecretaria.nombre} {selectedSecretaria  && selectedSecretaria.apellido}</h4>
                        {/*<p>Email: {selectedEspecialista.email}</p>*/}
                        <p>Cargo: {selectedSecretaria  && selectedSecretaria.cargo}</p>
                        <p>Contraseña: {selectedSecretaria  && selectedSecretaria.pass}</p>

                        <h4>Cambiar contraseña</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            selectedSecretaria && handleUpdatePass( selectedSecretaria.id);}}>

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
                            selectedSecretaria && handleUpdateEmail(selectedSecretaria.id);
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
                <h2>Cargos secretaria: </h2>
                <div className="row">
                    {data.getSecretarias.map(secr=>(
                        <div className="col-md-4" key={secr.id}>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">{secr.nombre}  {secr.apellido}</h5>
                                    <p className="card-text">RUT: {secr.Rut}</p>
                                    <p className='card-text'>PASS: {secr.pass}</p>
                                    <p className='card-text'>Cargo: {secr.cargo}</p>
                                    <p className="card-text">Email: {secr.email}</p>
                                    <h4 className='card-text' style={{ color: secr.estado === "habilitado" ? 'green' : 'red' }}>
                                    {secr.estado}
                                    </h4>
                                </div>
                                <button className='btn btn-light'  style={{ margin: "10px 20px" }} onClick={() => handleShow(secr)}><span style={{ color: "Blue"}}>Más información</span></button>
                                <button className='btn btn-light' onClick={() => handleDeleteDirectly(secr.id)}><span style={{color:"Red"}}>Eliminar</span></button> 
                                <div className='container col-12 w-100 px-2'>
                                    <button type="button" className="btn btn-success col-6 ml-2" onClick={() => handleChangeEstado(secr.id, "habilitado")}>Habilitar</button>
                                    <button type="button" className='btn btn-danger col-6' onClick={() => handleChangeEstado(secr.id, "deshabilitado")}>Deshabilitar</button>
                                </div>

                                
                            </div> 
                        </div>
                    ))}

                </div>
            </div>
            <div>                
                <h2>Agregar cargo secretaria</h2>
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
                                        <label className="form-label">Cargo:</label>
                                        <input type="text" className="form-control" value="Secretaria" readOnly />
                                    </div>

                                    <div className='mb-3'>
                                        <label className='form-label'>Email: </label>
                                        <input type='text' className='form-control' value={email} onChange={(e)=> setEmail(e.target.value)} />
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
                                        <input type="text" className="form-control" value={pass} onChange={(e) => setPass(e.target.value)} />
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