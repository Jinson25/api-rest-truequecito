const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // Verifica si el token tiene el formato esperado
      if (!token || token.split('.').length !== 3) {
        throw new Error('El formato del token JWT no es válido');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      console.error('Error al verificar el token:', err.message);
      res.status(401).json({ message: `No autorizado, error en el token: ${err.message}` });
    }
  } else {
    console.log('Token no proporcionado');
    res.status(401).json({ message: 'No autorizado, no se encontró el token' });
  }
};

module.exports = authMiddleware;