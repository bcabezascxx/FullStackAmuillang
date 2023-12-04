import React from 'react';


const MedicalHistory = ({ medicalHistory }) => {
  return (
    <div className="medical-history">
      <h3>Citas Médicas:</h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Fecha</th>
            <th>Paciente</th>
            <th>Número de Cédula</th>
            <th>Especialista</th>
          </tr>
        </thead>
        <tbody>
          {medicalHistory.map((entry, index) => (
            <tr key={index}>

              <td>{entry.date}</td>
              <td>{entry.patientName}</td>
              <td>{entry.cedula}</td>
              <td>{entry.specialistName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalHistory;
