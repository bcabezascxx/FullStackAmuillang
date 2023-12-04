import React from 'react';

const TodayAppointments = ({ todayAppointments }) => {
  return (
    <div className="today-appointments">
      <h3 className="mb-3 text-center">Citas de Hoy:</h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
          <th>Hora</th>
          <th>Paciente</th>
          <th>Lugar</th>
          <th>Direccion</th>          
</tr>
        </thead>
        <tbody>
          {todayAppointments.map((appointment, index) => (
            <tr key={index}>
            <td>{appointment.time}</td>
            <td>{appointment.patientName}</td>
            <td>{appointment.place}</td>
            <td>{appointment.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayAppointments;