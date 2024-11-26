import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import GenerateKeys from './components/GenerateKeys';
import EncryptData from './components/EncryptData';
import UploadDecrypt from './components/UploadDecrypt';
import Navbar from './components/Navbar'; // Import the Navbar component
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Navbar component */}
        <Navbar />
        
        {/* Routing for different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/generate-keys" element={<GenerateKeys />} />
          <Route path="/encrypt-data" element={<EncryptData />} />
          <Route path="/uploaddecrypt" element={<UploadDecrypt />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
