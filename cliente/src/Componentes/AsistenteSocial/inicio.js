import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const OBTENER_PACIENTES = gql`
  query getPacientes {
    getPacientes {
      id
      Rut
      nombre
      apellido
      tieneFichaMedica
    }
  }
`;

const ListaPacientes = () => {
  const { data, loading, error } = useQuery(OBTENER_PACIENTES);
  console.log(data)

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const pacientes = data.getPacientes;

 
  const pacientesSinFichaMedica = pacientes.filter(
    (paciente) => !paciente.tieneFichaMedica
  );
  const pacientesConFichaMedica = pacientes.filter(
    (paciente) => paciente.tieneFichaMedica
  );

  return (
    <div>
        <h1 className='text-center'>Lista de Pacientes</h1>
        <div className='container'>
            <br/>
            <h2>Sin Ficha Médica</h2>

            <table className='table table-striped'>
                <thead>
                <tr >
                    <th>RUT</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Ficha medica:</th>
                </tr>
                </thead>
                <tbody>
                {pacientesSinFichaMedica.map((paciente) => (
                    <tr key={paciente.id} className='table-danger'>
                    <td>{paciente.Rut}</td>
                    <td>{paciente.nombre}</td>
                    <td>{paciente.apellido}</td>
                    <td>{paciente.tieneFichaMedica ? "Posee" : "Faltante" }</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
        <br />
        <div className='container'>
        <h2>Con Ficha Médica</h2>
            <table className='table table-striped'>
                <thead>
                <tr>
                    <th>RUT</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                </tr>
                </thead>
                <tbody>
                {pacientesConFichaMedica.map((paciente) => (
                    <tr key={paciente.id} className='table-success'>
                    <td>{paciente.Rut}</td>
                    <td>{paciente.nombre}</td>
                    <td>{paciente.apellido}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
      
      
      

      
    </div>
  );
};

export default ListaPacientes;
