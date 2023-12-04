import React from 'react';

const UpcomingAppointments = ({ upcomingAppointments }) => {
  return (
    <div className="upcoming-appointments">
      <h3 className="mb-3 text-center">Próximas citas:</h3>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Lugar</th>
            <th>Paciente</th>
          </tr>
        </thead>
        <tbody>
          {upcomingAppointments.map((appointment, index) => (
            <tr key={index}>
              <td>{appointment.date}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.place}</td>
              <td>{appointment.patientName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingAppointments;
