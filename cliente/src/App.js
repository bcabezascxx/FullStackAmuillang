import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import specialistsData from './data';
import Especialista from "./Componentes/directora"
import Login from "./Componentes/login"
import Nav from "./Componentes/nav"

function App() {
  const [specialists, setSpecialists] = useState(specialistsData);

  return (
    <>

      <Login/>

    </>
  );
}

export default App;

