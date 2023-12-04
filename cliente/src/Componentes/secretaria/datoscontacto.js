import { useQuery, gql, useMutation } from "@apollo/client";
import React, { useState } from 'react';
import Nav from "./nav";
import Calendario from './Calendario'

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

const ACTUALIZAR_CONTACTO_PACIENTE = gql`
    mutation updateContactoPaciente($id: ID!, $input: ContactoPacienteInput!) {
        updateContactoPaciente(id: $id, input: $input) {
            id
            telefono
            email
            Direccion
        }
    }
`;

export default function Directora_busquedaPaciente() {
    const [Rut, setRut] = useState('');
    const [paciente, setPaciente] = useState(null);
    const [mensajeError, setMensajeError] = useState('');

    const [updateContacto] = useMutation(ACTUALIZAR_CONTACTO_PACIENTE);
    const [showEditForm, setShowEditForm] = useState(false);
    const [contactData, setContactData] = useState({ telefono: '', email: '', Direccion: '' });

    const { data, refetch } = useQuery(BUSCAR_PACIENTE_POR_RUT, { skip: true });

    const handleSearch = async (e) => {
        e.preventDefault();
        BuscarPorRut();
    };

    const BuscarPorRut = async () => {
        try {
            const response = await refetch({ Rut });
            if (response && response.data && response.data.buscarPacientePorRut) {
                setPaciente(response.data.buscarPacientePorRut);
            } else {
                setMensajeError("No se encontró el paciente con el Rut proporcionado.");
            }
        } catch (err) {
            console.log(err);
            if(err.graphQLErrors && err.graphQLErrors.length > 0) {
                setMensajeError(err.graphQLErrors[0].message);
            } else {
                setMensajeError("Ocurrió un error desconocido. Inténtelo de nuevo.");
            }
        }
    };

    const handleUpdateContactData = async () => {
        try {
            console.log("Variables antes de la mutación:", {
                id: paciente.id,
                input: {
                    telefono: parseInt(contactData.telefono),
                    email: contactData.email,
                    Direccion: contactData.Direccion
                }
            });
    
            await updateContacto({
                variables: {
                    id: paciente.id,
                    input: {
                        telefono: parseInt(contactData.telefono),
                        email: contactData.email,
                        Direccion: contactData.Direccion
                    }
                }
            });
    
            console.log("Mutación completada");
            setShowEditForm(false);

            BuscarPorRut();
        } catch (error) {
            console.error("Error al actualizar el contacto:", error.message);
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
    

    return (
        <div>
            <Nav />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card p-4 shadow">
                            <h2>Buscar paciente</h2>
                            <form onSubmit={handleSearch}>
                                <div className="mb-3">
                                    <label className="form-label">RUT:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={Rut}
                                        onChange={handleChangeRut}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Buscar</button>
                            </form>
                            {paciente && (
                                <div className="mt-5">
                                    <h4>Información del Paciente</h4>
                                    <p><strong>RUT:</strong> {paciente.Rut}</p>
                                    <p><strong>Nombre:</strong> {paciente.nombre}</p>
                                    <p><strong>Apellido:</strong> {paciente.apellido}</p> 
                                    <p><strong>Edad:</strong> {paciente.edad}</p> 
                                    <p><strong>Sexo:</strong> {paciente.sexo}</p> 
                                    <p><strong>Telefono:</strong> {paciente.telefono}</p> 
                                    <p><strong>Email:</strong> {paciente.email}</p> 
                                    <p><strong>Dirección :</strong> {paciente.Direccion}</p> 
                                    <p><strong>Fecha de nacimiento:</strong> {paciente.FechaNacimiento}</p> 

                                    {!showEditForm ? (
                                    <button className="btn btn-warning mt-2" onClick={() => setShowEditForm(true)}>Modificar datos de contacto</button>
                                ) : (
                                    <div className="mt-3">
                                        <input
                                            type="number"
                                            value={contactData.telefono}
                                            onChange={(e) => setContactData({ ...contactData, telefono: e.target.value })}
                                            placeholder="Teléfono"
                                            className="form-control my-2"
                                        />
                                        <input
                                            type="email"
                                            value={contactData.email}
                                            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                                            placeholder="Email"
                                            className="form-control my-2"
                                        />
                                        <input
                                            type="text"
                                            value={contactData.Direccion}
                                            onChange={(e) => setContactData({ ...contactData, Direccion: e.target.value })}
                                            placeholder="Dirección"
                                            className="form-control my-2"
                                        />
                                        <button className="btn btn-primary mt-2" onClick={handleUpdateContactData}>Guardar Cambios</button>
                                        <button className="btn btn-secondary mt-2 ml-2" onClick={() => setShowEditForm(false)}>Cancelar</button>
                                    </div>
                                )}

                                    
                                </div>
                            )}
                            {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
