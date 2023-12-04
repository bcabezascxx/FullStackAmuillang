import React from 'react';

const ObservationsList = ({ observations }) => {
  return (
    <div className="observations-list">
      <h3 className="mb-3">Listado de Observaciones Recientes:</h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Fecha</th>
            <th>RUT Paciente</th>
            <th>Especialista</th>
            <th>Observación</th>
          </tr>
        </thead>
        <tbody>
          {observations.map((observation, index) => (
            <tr key={index}>
              <td>{observation.date}</td>
              <td>{observation.cedula}</td>
              <td>{observation.specialistName}</td>
              <td>{observation.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ObservationsList;