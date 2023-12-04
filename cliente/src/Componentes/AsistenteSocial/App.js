import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import React, { useState } from 'react';
import SocialWorkerProfile from './SocialWorkerProfile';
import PatientRecords from './PatientRecords';
import MedicalHistory from './MedicalHistory';
import ObservationsList from './ObservationsList';
import MedicalHistoryTable from "./MedicalHistoryTable";
import PatientRecordsTable from "./PatientRecordsTable";
import AddPatientRecord from "./AddPatientRecord";
import Footer from './Footer';
import { socialWorkerData, patientRecordsData, medicalHistoryData, observationsData, patientRecordsHistoryData, medicalHistoryFullData} from './data';
import Nav from "./nav"
import Inicio from "./inicio"

function App() {
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [showPatientRecordsTable, setShowPatientRecordsTable] = useState(false);
  const [patientRecords, setPatientRecords] = useState(patientRecordsHistoryData);

  const handleAddRecord = (newRecord) => {
    setPatientRecords([...patientRecords, newRecord]);
  };

  return (
    <div className="App">
        <Nav/>
        <Inicio/>
        

     <br/>
     <br/>           
     <Footer></Footer>  
    </div>
  );
}

export default App;