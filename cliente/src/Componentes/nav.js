import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav as BootstrapNav } from "react-bootstrap";
import logo from "./img/marca-fondoblanco.png";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div>
      <Navbar expand="lg" className="navbar-custom">
        <Container fluid>
          <Navbar.Brand href="#">
            <img src={logo} className="img-fluid" alt="Logo" style={{ width: "50px", height: "60px" }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav" className="justify-content-end">
            <BootstrapNav>
              <BootstrapNav.Item>
                <Link to="/directora/especialista" className="nav-link" style={{ fontWeight: "bold" }}>
                  Inicio
                </Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                <Link to="/directora/secretaria" className="nav-link" style={{ fontWeight: "bold" }}>
                  Secretarias
                </Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                <Link to="/directora/asistenteSocial" className="nav-link" style={{ fontWeight: "bold" }}>
                  Asistente Social
                </Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                <Link to="/directora/paciente" className="nav-link" style={{ fontWeight: "bold" }}>
                  Pacientes
                </Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                <Link to="/directora/busquedaPaciente" className="nav-link" style={{ fontWeight: "bold" }}>
                  Busqueda por rut
                </Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                <Link to="/login" className="nav-link" style={{ color: "blue", fontWeight: "bold" }}>
                  Cerrar sesión
                </Link>
              </BootstrapNav.Item>
            </BootstrapNav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}


