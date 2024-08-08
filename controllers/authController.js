const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/token');

exports.registerUser = async (req, res) => {
  const { email, password, username, avatar } = req.body;
  try {
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Por favor, proporciona todos los campos necesarios' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({
      email,
      password, // La contraseña se encriptará automáticamente en el esquema
      username,
      avatar
    });

    res.status(201).json({
      user: {
        id: user.id, // Cambiar de _id a id
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role // Agregar el role aquí si no está
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.oauthRegisterUser = async (profile, done) => {
  const { id, displayName, emails, photos } = profile;
  try {
    const email = emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: id,
        email,
        username: displayName,
        avatar: photos[0].value
      });
    }

    done(null, {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    done(error, null);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, proporciona todos los campos necesarios' });
    }

    const user = await User.findOne({ email });

    console.log('Usuario encontrado para el email:', user);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Comparación de contraseñas:', isMatch, 'Ingresada:', password, 'Almacenada:', user.password);

      if (isMatch) {
        // Calcular reputación basada en el número de intercambios
        if (user.exchanges >= 15) {
          user.reputation = 5;
        } else {
          user.reputation = Math.round((user.exchanges / 15) * 5);
        }
        await user.save();
        console.log(`Reputation después de guardar: ${user.reputation}`);

        res.json({
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
            exchanges: user.exchanges,
            reputation: user.reputation
          },
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Credenciales no válidas' });
      }
    } else {
      res.status(401).json({ message: 'Credenciales no válidas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
