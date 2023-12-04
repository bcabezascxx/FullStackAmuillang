import React, { useState } from "react";
import "./styles.css";
import logo from "./img/marca-fondoblanco.png";
import dataespecialista from "./componentes/DataEspecialista";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ReservaHora = () => {
  const [filtro, setFiltro] = useState("Fonoaudiología");
  const [rut, setRut] = useState("");
  const [resultados, setResultados] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendadas, setAgendadas] = useState([]);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleRutChange = (e) => {
    setRut(e.target.value);
  };

  const handleSubmit = () => {
    const resultadosFiltrados = dataespecialista.filter(
      (item) => item.cargo === filtro
    );
    setResultados(resultadosFiltrados);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAgendar = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    if (getAvailableDates().includes(formattedDate)) {
      setAgendadas([...agendadas, formattedDate]);
    }
  };

  const getAvailableDates = () => {
    const availableDates = [];

    resultados.forEach((item) => {
      item.horarios.forEach((horario) => {
        availableDates.push(horario.fecha);
      });
    });

    return availableDates;
  };

  const customTileClass = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const availableDates = getAvailableDates().map(
      (d) => d.toISOString().split("T")[0]
    );

    if (availableDates.includes(formattedDate)) {
      return <div className="available">.</div>;
    }
    if (agendadas.includes(formattedDate)) {
      return <div className="agendada">.</div>;
    }
    return null;
  };

  const handleLimpiar = () => {
    setFiltro("");
    setRut("");
    setResultados([]);
    setAgendadas([]);
  };

  return (
    <div className="container mt-0">
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              className="img-fluid"
              style={{ width: "50px", height: "60px" }}
              alt="Logo"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Reserva de Hora
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Datos de Paciente
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="">
        <div className="card mt-4 " style={{ maxWidth: "700px" }}>
          <div className="card-header">Reserva Hora</div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <select
                  className="form-select mb-4"
                  value={filtro}
                  onChange={handleFiltroChange}
                >
                  <option value="">Selecciona una Especialidad</option>
                  <option value="Fonoaudiología">Fonoaudiología</option>
                  <option value="Oftalmología">Oftalmología</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Dermatología">Dermatología</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-20">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingresar Rut"
                    value={rut}
                    onChange={handleRutChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleLimpiar}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 text-center">
                <button className="btn btn-purple" onClick={handleSubmit}>
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <h4>Calendarios</h4>
          <ul>
            {resultados.map((item) => (
              <li key={item.id}>
                <p>Nombre: {item.nombre}</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Calendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    tileContent={customTileClass}
                  />
                  <button className="btn btn-purple" onClick={handleAgendar}>
                    Agendar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReservaHora;
