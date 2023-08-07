import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; 
import PatientsList from './components/PatientsList';
import PatientForm from './components/PatientForm';
import PatientDetails from './components/PatientDetails';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/patients/create" element={<PatientForm />} />
        <Route path="/patients/update/:id" element={<PatientForm />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
      </Routes>
    </Router>
  );
}

export default App;