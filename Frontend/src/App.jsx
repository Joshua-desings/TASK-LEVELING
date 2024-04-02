import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NoteManagerPage from './pages/NoteManagerPage';
import { AuthProvider, useAuth } from './hooks/AuthContext';
import Sidebar from './components/Sidebar'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Corrige el uso del componente PrivateRoute */}
          <Route path="/notes" element={<PrivateRoute />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Componente para proteger rutas privadas
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth(); // Obtiene el estado de autenticación desde el contexto

  // Renderiza la página de administración de notas si el usuario está autenticado, de lo contrario, redirige a la página de inicio de sesión
  return isAuthenticated ? (
    <>
      <Sidebar />
      <NoteManagerPage />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
