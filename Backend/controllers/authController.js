const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Esquema de validación para la solicitud de registro
const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Esquema de validación para la solicitud de inicio de sesión
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.signup = async (req, res) => {
  try {
    // Validar los datos de entrada
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    // Obtenemos los datos del cuerpo de la solicitud
    const { email, password } = req.body;

    // Buscamos el usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Correo electrónico no registrado' });
    }

    // Verificamos la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Verificamos si el usuario es un administrador
    if (user.role === 'Admin') {
      // Si es un administrador, generamos un token de administrador
      const adminToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ADMIN_TOKEN_SECRET);
      return res.status(200).json({ message: 'Inicio de sesión exitoso como administrador', token: adminToken });
    }

    // Si no es un administrador, generamos un token de usuario normal
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({ message: 'Inicio de sesión exitoso', token: accessToken });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Ocurrió un error al iniciar sesión' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Implementa la lógica para cerrar sesión de usuarios aquí
    // Por ejemplo, podrías eliminar la sesión del usuario o realizar cualquier otra acción necesaria
    // Aquí un ejemplo simple de cómo podrías borrar la sesión en el servidor (si estás usando sesiones):
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).send('Error al cerrar sesión');
      } else {
        res.send('Sesión cerrada exitosamente');
      }
    });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).send('Error al cerrar sesión');
  }
};

