import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { Button, TextField, Typography, Container, Grid, Snackbar } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../hooks/AuthContext'; // Importa el hook de autenticación

const LoginPage = () => {
  const { login } = useAuth(); // Usa el hook de autenticación para acceder a las funciones de inicio de sesión
  const navigate = useNavigate(); // Usa useNavigate para la redirección
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorAlert, setErrorAlert] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', data); // Endpoint de inicio de sesión en el backend
      
      // Verificar si el inicio de sesión fue exitoso y si se recibió un token válido del servidor
      if (response.data.token) {
        // Llamar a la función de inicio de sesión proporcionada por el contexto
        login();
        navigate('/notes'); // Redirige a la página de notas
      } else {
        // Mostrar alerta de error si no se recibió un token válido del servidor
        setErrorAlert(true);
      }
    } catch (error) {
      // Mostrar alerta de error si hay un error al intentar iniciar sesión
      setErrorAlert(true);
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleCloseErrorAlert = () => {
    setErrorAlert(false);
  };

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={8} md={6}>
          <Typography variant="h4" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email', { required: 'El correo electrónico es obligatorio' })}
              type="email"
              label="Correo Electrónico"
              variant="outlined"
              fullWidth
              margin="normal"
              error={errors.email ? true : false}
              helperText={errors.email && errors.email.message}
            />
            <TextField
              {...register('password', { required: 'La contraseña es obligatoria' })}
              type="password"
              label="Contraseña"
              variant="outlined"
              fullWidth
              margin="normal"
              error={errors.password ? true : false}
              helperText={errors.password && errors.password.message}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Iniciar Sesión
            </Button>
          </form>
          <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </Typography>
        </Grid>
      </Grid>

      {/* Alerta de error */}
      <Snackbar
        open={errorAlert}
        autoHideDuration={6000}
        onClose={handleCloseErrorAlert}
        message="Inicio de sesión fallido. Verifica tus credenciales e intenta nuevamente."
      />
    </Container>
  );
};

export default LoginPage;
