const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verifica si el token tiene el formato esperado
      if (token.split('.').length !== 3) {
        throw new Error('El formato del token JWT no es válido');
      }
      
      // Decodifica el token y verifica su validez
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Encuentra el usuario basado en el ID decodificado y excluye la contraseña
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
      
      // Pasa al siguiente middleware o ruta
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
