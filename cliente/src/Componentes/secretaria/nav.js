import React from "react";
import "./style.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav as BootstrapNav } from "react-bootstrap";
import logo from "../img/marca-fondoblanco.png"
import {Link} from "react-router-dom"


export default function nav(){
    return(
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
                <Link to="/secretaria/inicio" className="nav-link" style={{fontWeight:"bold"}}>
                  Inicio
                </Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                <Link to="/secretaria/Agendamiento" className="nav-link" style={{fontWeight:"bold"}}>
                Agendamiento
                </Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                <Link to="/secretaria/datoscontacto" className="nav-link" style={{fontWeight:"bold"}}>
                Modificar datos de contacto
                </Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                <Link to="/login" className="nav-link" style={{color:"blue", fontWeight:"bold"}}>
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