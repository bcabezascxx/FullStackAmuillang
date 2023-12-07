import React, { useState } from 'react';
import { useQuery, gql, useEffect } from "@apollo/client";
import Nav from "./nav";
//import FichaMedica from "./AsistenteSocial_VerFichaMedica";
import FichaMedica from './AsistenteSocial_FichaMedica';
import {validateRut} from "rutlib"


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

export default function Directora_busquedaPaciente() {
    const [Rut, setRut] = useState('');
    const [paciente, setPaciente] = useState(null);
    const [mensajeError, setMensajeError] = useState('');
    const [mostrarFicha, setMostrarFicha] = useState(false);

    const { data, refetch } = useQuery(BUSCAR_PACIENTE_POR_RUT, { skip: true });

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

    

    const handleSearch = async (e) => {
        e.preventDefault();
        BuscarPorRut();
    };

    const BuscarPorRut = async () => {
        try {
            const response = await refetch({ Rut });
            if (response && response.data && response.data.buscarPacientePorRut) {
                setPaciente(response.data.buscarPacientePorRut);
                setMostrarFicha(false); 
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
                                    <input type="text" className="form-control" value={Rut} onChange={ (e) => { setRut(e.target.value); handleChange(e)}} required />
                                </div>
                                <button type="submit" className="btn btn-primary">Buscar</button>
                            </form>

                            {mostrarFicha ? 
                                <FichaMedica paciente={paciente} /> 
                                : 
                                paciente && (
                                    <div className="mt-5">
                                        <h4>Información del Paciente</h4>
                                        <p><strong>RUT:</strong> {paciente.Rut}</p>
                                        <p><strong>Nombre:</strong> {paciente.nombre}</p>
                                        <p><strong>Apellido:</strong> {paciente.apellido}</p>
                                        <div>
                                            <button onClick={() => {
                                                window.open('/AsistenteSocial/FichaMedica/' + paciente.id, '_blank')
                                                }}> 
                                                Ver ficha médica
                                            </button>                                        
                                        </div>
                                    </div>
                                )
                            }

                            {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

