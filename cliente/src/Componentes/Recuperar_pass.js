import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import logo from "./img/marca-fondoblanco.png";
import { Link } from 'react-router-dom';

export default function RecuperarContrasena() {
  const [solicitudEnviada, setSolicitudEnviada] = useState('');
  const [rut, setRut] = useState('')
  const [email, setEmail] = useState('')


  


  const handleEnviarCorreo = async (event) => {
    event.preventDefault();
  
    try {

      const servicioCorreo = 'service_r7yijvw'; 
      const templateID = 'template_2a9j76s'; 
      const userID = 'jhMkGddPANojUpI5z'; 
  
      const mensaje = {
        rut: rut,
        email: email,
        subject: 'Solicitud de cambio de contraseña contraseña',
        body: `El profesional con RUT: ${rut} necesita cambiar contraseña, el especialista tiene correo ${email}`
      };
  

      const response = await emailjs.send(servicioCorreo, templateID, mensaje, userID);
      console.log('Correo enviado con éxito:', response);

      setSolicitudEnviada("Solicitud enviado")
  

  
    } catch (error) {
      console.log("error al enviar correo", error)

      setSolicitudEnviada("Correo no enviado")


    }
  }
  

  return (
    <div>
      <main className="d-flex justify-content-center align-items-center vh-100">
        <div className="container">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="text-center mb-4 logo-container">
                <img src={logo} alt="Logo Amuillang" className="img-fluid logo-outside" />
              </div>
              <div className="card">
                <div className="card-body">
                  <h1 className="card-title text-center mb-4">Recuperar Contraseña</h1>
                  <form onSubmit={handleEnviarCorreo}>
                    <div className="form-group">
                      <label htmlFor="rut">RUT:</label>
                      <input
                        type="text"
                        value={rut}
                        className="form-control"
                        placeholder="Ingrese su RUT"
                        required
                        name="rut"
                        onChange={(e) => setRut(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="correo">Correo Electrónico:</label>
                      <input
                        type="email"
                        value={email}
                        className="form-control"
                        placeholder="Ingrese su correo electrónico"
                        required
                        name="correo"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-100" style={{ backgroundColor: '#800080' }}>
                      Recuperar Contraseña
                    </button>
                    {solicitudEnviada && <p>{solicitudEnviada}</p>}
                  </form>
                  
                  <div className="form-group text-center mt-4">
                    <Link to="/" className="d-block mb-3">Volver al inicio de sesión</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

