// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ message: 'No se proporcionó un token de acceso' });
  }

  try {
    // Verificar token de acceso
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token de acceso inválido' });
  }
};
