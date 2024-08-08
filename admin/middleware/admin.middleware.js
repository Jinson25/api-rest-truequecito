module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
      next();
    } else {
      res.status(403).json({ message: 'Acceso denegado' });
    }
  };