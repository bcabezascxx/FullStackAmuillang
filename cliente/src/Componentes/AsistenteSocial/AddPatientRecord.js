import React, { useState } from 'react';

const AddPatientRecord = ({ onAddRecord }) => {
  const [newRecord, setNewRecord] = useState({
    name: '',
    cedula: '',
    lastAppointment: '',
    condition: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleAddClick = () => {
    onAddRecord(newRecord); 
    setNewRecord({
      name: '',
      cedula: '',
      lastAppointment: '',
      condition: '',
    });
  };

  return (
    <div className="add-patient-record">
      <h3>Agregar Nuevo Registro de Paciente</h3>
      <form>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={newRecord.name}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Número de Cédula:</label>
          <input
            type="text"
            name="cedula"
            value={newRecord.cedula}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Fecha de la última cita:</label>
          <input
            type="text"
            name="lastAppointment"
            value={newRecord.lastAppointment}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Condición:</label>
          <input
            type="text"
            name="condition"
            value={newRecord.condition}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddClick}
        >
          Agregar Registro
        </button>
      </form>
    </div>
  );
};

export default AddPatientRecord;
