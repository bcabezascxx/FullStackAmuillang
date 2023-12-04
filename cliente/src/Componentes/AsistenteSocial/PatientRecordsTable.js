import React from 'react';

const PatientRecordsTable = ({ patientRecords }) => {
  return (
    <div className="patient-records-table">
      <h3 className="mb-3">Historial de Pacientes:</h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Nombre</th>
            <th>Número de Cédula</th>
            <th>Fecha de la última cita</th>
            <th>Condición</th>
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

export default PatientRecordsTable;
