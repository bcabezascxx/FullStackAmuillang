import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import "./login.css"
import logo from "./img/marca-fondoblanco.png"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const INICIAR_SESION = gql`
  mutation iniciarSesion($Rut: String!, $pass: String!) {
    iniciarSesion(Rut: $Rut, pass: $pass) {
      id
      message
      cargo
    }
  }
`;


function Login() {
  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [Rut, setRut] = useState('');
  const [pass, setPass] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [iniciarSesion] = useMutation(INICIAR_SESION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const { data } = await iniciarSesion({ variables: { Rut, pass } });
      

      if (data.iniciarSesion.cargo === 'Directora') {
        setAuthenticated(true, "directora");
        navigate('/directora/especialista', {state: {directoraId: data.iniciarSesion.id}}, sessionStorage.setItem('directoraId', data.iniciarSesion.id));
      } else if (data.iniciarSesion.cargo === 'Secretaria') {
        setAuthenticated(true, "secretaria");
        navigate('/secretaria/inicio');
      } else if (data.iniciarSesion.cargo === 'Nutricionista') {
        setAuthenticated(true, "especialista");
        sessionStorage.setItem('especialistaId', data.iniciarSesion.id)
        navigate('/especialista/inicio', { state: { especialistaId: data.iniciarSesion.id } });
      } else if (data.iniciarSesion.cargo === 'Psicologo') {
        setAuthenticated(true, "especialista");
        sessionStorage.setItem('especialistaId', data.iniciarSesion.id)
        navigate('/especialista/inicio', {state: {especialistaId: data.iniciarSesion.id}});
      } else if (data.iniciarSesion.cargo === 'Kinesiologo') {
        setAuthenticated(true, "especialista");
        sessionStorage.setItem('especialistaId', data.iniciarSesion.id)
        navigate('/especialista/inicio', {state: {especialistaId: data.iniciarSesion.id}});
      } else if (data.iniciarSesion.cargo === 'Fonoaudiologia') {
        setAuthenticated(true, "especialista");
        sessionStorage.setItem('especialistaId', data.iniciarSesion.id)
        navigate('/especialista/inicio', {state: {especialistaId: data.iniciarSesion.id}});
      } else if (data.iniciarSesion.cargo === 'Asistente Social') {
        setAuthenticated(true, "AsistenteSocial");
        sessionStorage.setItem('AsistenteSocialId', data.iniciarSesion.id)
        navigate('/AsistenteSocial/inicio');
      }

      setMensaje(data.iniciarSesion.message);
    } catch (err) {
      setMensaje(err.message);
    }
  };

  const ValidarRut = (Entrada) => {
    const ValorLimpioInput = Entrada.replace(/[^\d-]/g, '');

    if (
      /^[0-9]{8,9}-[0-9]$/.test(ValorLimpioInput) ||
      /^[0-9]{7,8}-[0-9]$/.test(ValorLimpioInput)
    ) {
      setRut(ValorLimpioInput);
    } else {
      setRut(Entrada);
    }
  };

  const handleChangeRut = (e) => {
    ValidarRut(e.target.value);
  };

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
                  <h1 className="card-title text-center mb-4">Amuillang</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label htmlFor="rut">RUT</label>
                        <input
                          value={Rut} onChange={handleChangeRut}
                          className='form-control'
                          placeholder='RUT'
                          required
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                          type="password"
                          className="form-control"
                          value={pass}
                          onChange={(e) => setPass(e.target.value)}
                          placeholder="Ingresa tu contraseña"
                          required />
                      </div>
                    </div>
                    <div className="form-group text-center mt-4">
                      <Link to="/recuperarClave" target="_blank" rel="noopener noreferrer" className="d-block mb-3">Recuperar contraseña</Link>
                      <button type="submit" className="btn btn-primary btn-lg w-100" style={{ backgroundColor: '#800080' }}>Iniciar Sesión</button>
                    </div>
                  </form>
                  {mensaje && <p>{mensaje}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;

