import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from './nav';
import { useMutation, gql } from "@apollo/client";
import { Link, useAsyncError, useLocation, useNavigate } from 'react-router-dom';

const UPDATE_ESPECIALISTA_HORARIOS = gql`
  mutation UpdateEspecialistaHorarios($id: ID!, $horarios: [HorarioInput]!) {
    updateEspecialistaHorarios(id: $id, horarios: $horarios) {
      id
      horarios {
        fecha
        hora
      }
    }
  }
`;

const EspecialistaHorasMas = () => {
  const { state } = useLocation();
  const especialistaId = state?.especialistaId || sessionStorage.getItem('especialistaId');
  console.log(typeof especialistaId)
  console.log("ID TRAIDA: ",especialistaId)

  const [updateEspecialistaHorarios] = useMutation(UPDATE_ESPECIALISTA_HORARIOS);
  const [cantidadHoras, setCantidadHoras] = useState(1);
  const [donaciones, setDonaciones] = useState([]);
  const [mensajeDuplicado, setMensajeDuplicado] =useState('')

  const handleCantidadHorasChange = (e) => {
    setCantidadHoras(parseInt(e.target.value, 10));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevasDonaciones = [];
    for (let i = 0; i < cantidadHoras; i++) {
      const fecha = e.target[`fecha_${i}`].value;
      const hora = e.target[`hora_${i}`].value;

      if (fecha && hora) {
        nuevasDonaciones.push({
          fecha,
          hora,
        });
      }
    }

    if (nuevasDonaciones.length > 0) {
      setDonaciones([...donaciones, ...nuevasDonaciones]);
      console.log('Donaciones registradas:', nuevasDonaciones);
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  const navigate = useNavigate()

  const confirmarHoras = async () => {
    const especialistaIdString=especialistaId.toString()
    try {
      const { data } = await updateEspecialistaHorarios({
        variables: {
          id: especialistaIdString, // Replace with the actual ID of the specialist
          horarios: donaciones,
        },
      });

      console.log('Horarios actualizados:', data.updateEspecialistaHorarios);
      navigate('/especialista/inicio')
      // Optionally, you can reset the donaciones state or navigate to another page upon successful update.
    } catch (error) {
      console.error('Error al actualizar horarios:', error.message);
      setMensajeDuplicado(error.message)
    }
  };

  const renderHorasInputs = () => {
    const inputs = [];
    for (let i = 0; i < cantidadHoras; i++) {
      inputs.push(
        <div key={i}>
          <h4 className="mt-3">Hora {i + 1}</h4>

          <div className="mb-3">
            <label className="form-label">Fecha:</label>
            <input
              type="date"
              className="form-control"
              name={`fecha_${i}`}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Hora:</label>
            <input
              type="time"
              className="form-control"
              name={`hora_${i}`}
              required
            />
          </div>
        </div>
      );
    }
    return inputs;
  };

  return (
    <div>
      <Nav />
      <div className="container mt-5">
        <h2 className="mb-4">Formulario de Donación de Horas</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Cantidad de Horas a Donar:</label>
            <input
              type="number"
              className="form-control"
              value={cantidadHoras}
              onChange={handleCantidadHorasChange}
              min="1"
            />
          </div>

          {renderHorasInputs()}

          <button type="submit" className="btn btn-primary">
            Seleccionar
          </button>
        </form>
        <br/>
        <Link to="/especialista/inicio"><button className='btn btn-primary'>Volver</button></Link>


        <div className="mt-4">
          <h3>Donaciones Registradas</h3>
          <ul className="list-group">
            {donaciones.map((donacion, index) => (
              <li key={index} className="list-group-item">
                {`Hora: ${index + 1}, Fecha: ${donacion.fecha}, Hora: ${donacion.hora}`}
              </li>
            ))}
          </ul>
        </div>
        <br></br>

        {donaciones.length > 0 ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={confirmarHoras}
          >
            Confirmar Horas
          </button> 
          
        ) : (
          <div></div>
        )}
        {mensajeDuplicado && mensajeDuplicado}
      </div>
    </div>
  );
};

export default EspecialistaHorasMas;
