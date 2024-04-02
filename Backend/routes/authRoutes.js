// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registrar un nuevo usuario
router.post('/signup', authController.signup);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para cerrar sesión
router.post('/logout', authController.logout);

module.exports = router;
