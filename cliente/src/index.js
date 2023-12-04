import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createBrowserRouter, RouterProvider,Routes, Route} from "react-router-dom";
import Especialista from "./Componentes/directora"
import Login from "./Componentes/login"
import Directora_secretaria from './Componentes/directora_secretaria';
import Directora_busquedaPaciente from './Componentes/directora_busquedaPaciente'
import Directora_paciente from './Componentes/directora_paciente';
import Directora_asistenteSocial from './Componentes/directora_asistenteSocial';
import PatientSearch from './Componentes/secretaria/datoscontacto';
import AsistenteSocial from './Componentes/AsistenteSocial/App';
import FichaMedica from './Componentes/VerFichaMedica';
import Paciente_asistenteSocial from './Componentes/AsistenteSocial/AsistenSocial_paciente';
import Busqueda_asistenteSocial from './Componentes/AsistenteSocial/AsistenteSocial_busquedaPaciente'
import Agendamiento from './Componentes/secretaria/Calendario'
import EspecialistaRut from './Componentes/Especialista/Especialista_busquedaPaciente';
import EspecialistaFichaMedica from './Componentes/Especialista/Especialista_VerFichaMedica';
import AsistenteSocial_FichaMedica from './Componentes/AsistenteSocial/AsistenteSocial_FichaMedica';
import RecuperarContrasena from "./Componentes/Recuperar_pass"
import InicioSecretaria from './Componentes/secretaria/inicio'
import InicioEspecialista from './Componentes/Especialista/especialista'
import { AuthProvider } from './Componentes/AuthContext';
import PrivateRoute from './Componentes/PrivateRoute'; // Proteguer rutas
import AgregarHorasEspecialistas from './Componentes/Especialista/especialistaMasHoras'




const router=createBrowserRouter([

{
  path:'/',
  element: <App/>,
},
{
  path:'directora/*',
  element: <PrivateRoute allowedUserTypes={['directora']} />,
  children:[
    {
      path:'especialista', element: <Especialista/>
    },
    {
      path: 'secretaria', element: <Directora_secretaria />
    },
    {
      path: 'busquedaPaciente', element: <Directora_busquedaPaciente/>
    },
    {
      path: 'paciente', element: <Directora_paciente/>
    },
    {
      path: 'asistenteSocial', element: <Directora_asistenteSocial/>
    },
  ]
},
{
  path: '/login',
  element: <Login/>,
},
{
  path:'secretaria/*',
  element: <PrivateRoute allowedUserTypes={['secretaria']} />,
  children:[
    {
      path:'datoscontacto',
      element: <PatientSearch/>
    },
    {
      path: 'Agendamiento',
      element: <Agendamiento/>
    },
    {
      path: 'inicio',
      element: <InicioSecretaria/>
    },
  ]
},
{
    path: 'asistenteSocial/*',
    element: <PrivateRoute allowedUserTypes={['AsistenteSocial']}/>,
    children:[
      {
        path: 'inicio',
        element: <AsistenteSocial/>

      },
    ]
},
{
  path: 'FichaMedica/*',
  element: <PrivateRoute/>,
  children:[
    {
      path: ':pacienteId', element: <FichaMedica />
    }
  ]
},
{
  path: 'AsistenteSocial/*',
  element: <PrivateRoute allowedUserTypes={['AsistenteSocial']}/>,
  children:[
    {
      path: 'paciente',
      element: <Paciente_asistenteSocial/>
    },
    {
      path: 'busquedaPaciente',
      element: <Busqueda_asistenteSocial/>
    },
    {
      path: 'FichaMedica/:pacienteId',
      element: <AsistenteSocial_FichaMedica/>
    },
  ]
},
{
  path:'especialista/*',
  element:<PrivateRoute allowedUserTypes={['especialista']}/>,
  children:[
    {
      path: 'busquedaRut',
      element: <EspecialistaRut/>
    },
    {
      path: 'fichaMedica/:pacienteId',
      element: <EspecialistaFichaMedica/>
    },
    {
      path: 'inicio',
      element: <InicioEspecialista/>
    },
    {
      path:'agregarHoras',
      element: <AgregarHorasEspecialistas/>
    }
  ]
},
{
  path: '/recuperarClave',
  element: <RecuperarContrasena/>
},

/*{
  path:'/directora/especialista',
  element: <PrivateRoute  element={()=> <Especialista />} />,

},
{
  path: '/directora/secretaria',
  element: <PrivateRoute  element= {<Directora_secretaria />}/>,
},
{
  path: '/directora/busquedaPaciente',
  element: <PrivateRoute  element={<Directora_busquedaPaciente/>}/>,
},
{
  path: '/directora/paciente',
  element: <PrivateRoute  element={<Directora_paciente/>}/>,
},
{
  path: '/directora/asistenteSocial',
  element: <PrivateRoute  element={<Directora_asistenteSocial/>}/>,
},
{
  path:'/secretaria/datoscontacto',
  element: <PrivateRoute  element={<PatientSearch/>}/>,
},
{
  path: '/asistenteSocial/inicio',
  element: <PrivateRoute  element={<AsistenteSocial/>}/>,
},
{
  path: '/FichaMedica/:pacienteId',
  element: <PrivateRoute  element={<FichaMedica/>} />,
},
{
  path: '/AsistenteSocial/paciente',
  element: <PrivateRoute  element={<Paciente_asistenteSocial/>} />,
},
{
  path: '/AsistenteSocial/busquedaPaciente',
  element: <PrivateRoute  element={<Busqueda_asistenteSocial/>}/>,
},
{
  path: '/AsistenteSocial/FichaMedica/:pacienteId',
  element: <PrivateRoute  element={<AsistenteSocial_FichaMedica/>} />,
},
{
  path: '/secretaria/Agendamiento',
  element: <PrivateRoute  element={<Agendamiento/>}/>,
},
{
  path: '/especialista/busquedaRut',
  element: <PrivateRoute  element={<EspecialistaRut/>}/>,
},
{
  path: '/especialista/fichaMedica/:pacienteId',
  element: <PrivateRoute  element={<EspecialistaFichaMedica/>}/>,

},
{
  path: '/secretaria/inicio',
  element: <PrivateRoute  element={<InicioSecretaria/>}/>
},
{
  path: '/especialista/inicio',
  element: <PrivateRoute element={<InicioEspecialista/>}/>
}
  
*/
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ApolloProvider>
);


reportWebVitals();
