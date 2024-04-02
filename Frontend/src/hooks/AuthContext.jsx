import React, { createContext, useContext, useState } from 'react';

// Crea el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor de autenticación que envuelve toda la aplicación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para iniciar sesión
  const login = () => {
    setIsAuthenticated(true);
  };

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false);
  };

  // Objeto de contexto de autenticación
  const authContextValue = {
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
