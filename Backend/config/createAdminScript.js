// createAdminScript.js

const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

dotenv.config();

const createAdmin = async () => {
  try {
    // Verificar si ya existe un administrador en la base de datos
    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (existingAdmin) {
      console.log('Ya existe un administrador en la base de datos');
      return;
    }

    // Obtener las credenciales del administrador primordial desde el archivo .env
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Generar el hash de la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crear el administrador primordial
    const admin = new User({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: 'Admin'
    });

    // Guardar el administrador en la base de datos
    await admin.save();
    console.log('Administrador primordial creado exitosamente');
  } catch (error) {
    console.error('Error al crear el administrador:', error);
  }
};

// Ejecutar la función para crear el administrador primordial
createAdmin();
