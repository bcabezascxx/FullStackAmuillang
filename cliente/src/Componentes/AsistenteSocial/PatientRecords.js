import React from 'react';

const PatientRecords = ({ patientRecords }) => {
  return (
    <div className="patient-records">
      <h3 className="mb-3">Fichas de Pacientes:</h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Fecha de Última Cita</th>
            <th>Condicion</th>
          </tr>
        </thead>
        <tbody>
          {patientRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.name}</td>
              <td>{record.cedula}</td>
              <td>{record.lastAppointment}</td>
              <td>{record.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientRecords;
