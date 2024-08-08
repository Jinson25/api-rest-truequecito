const User = require('../models/User');
const Follower = require('../models/Follower');
const Like = require('../models/Like');

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar perfil del usuario autenticado
exports.updateProfile = async (req, res) => {
  const { username, avatar, exchanges } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.username = username || user.username;
    user.avatar = avatar || user.avatar;

    if (typeof exchanges === 'number' && exchanges >= 0) {
      user.exchanges = exchanges;
      console.log(`Exchanges antes de guardar: ${user.exchanges}`);

      if (user.exchanges >= 15) {
        user.reputation = 5;
      } else {
        user.reputation = Math.round((user.exchanges / 15) * 5);
      }
      console.log(`Reputation antes de guardar: ${user.reputation}`);
    }

    await user.save();
    console.log(`Usuario guardado: ${user}`);
    res.json(user);
  } catch (err) {
    console.error('Error actualizando perfil:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener perfil de un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('products', 'title description images estado preference');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Calcular reputación basada en el número de intercambios
    if (user.exchanges >= 15) {
      user.reputation = 5;
    } else {
      user.reputation = Math.round((user.exchanges / 15) * 5);
    }
    console.log(`Reputation calculada en getUserById: ${user.reputation}`);

    res.json({ user });
  } catch (err) {
    console.error('Error obteniendo usuario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Seguir a un usuario
exports.followUser = async (req, res) => {
  const { userId } = req.params;
  const { id: followerId } = req.user;

  if (userId === followerId) {
    return res.status(400).json({ message: "No puedes seguirte a ti mismo." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (user.followers.includes(followerId)) {
      return res.status(400).json({ message: "Ya sigues a este usuario." });
    }

    user.followers.push(followerId);
    await user.save();

    res.status(200).json({ message: "Usuario seguido con éxito." });
  } catch (error) {
    console.error("Error al seguir al usuario:", error);
    res.status(500).json({ message: "Error al seguir al usuario. Inténtalo de nuevo más tarde." });
  }
};

// Dejar de seguir a un usuario
exports.unfollowUser = async (req, res) => {
  const { userId } = req.params;
  const { id: followerId } = req.user;

  if (userId === followerId) {
    return res.status(400).json({ message: "No puedes dejar de seguirte a ti mismo." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const followerIndex = user.followers.indexOf(followerId);
    if (followerIndex === -1) {
      return res.status(400).json({ message: "No sigues a este usuario." });
    }

    user.followers.splice(followerIndex, 1);
    await user.save();

    res.status(200).json({ message: "Usuario dejado de seguir con éxito." });
  } catch (error) {
    console.error("Error al dejar de seguir al usuario:", error);
    res.status(500).json({ message: "Error al dejar de seguir al usuario. Inténtalo de nuevo más tarde." });
  }
};

// Dar like a un usuario
exports.likeUser = async (req, res) => {
  const { userId } = req.params;
  const { id: likerId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (user.likes.includes(likerId)) {
      return res.status(400).json({ message: "Ya has dado like a este usuario." });
    }

    user.likes.push(likerId);
    await user.save();

    res.status(200).json({ message: "Usuario recibió like con éxito." });
  } catch (error) {
    console.error("Error al dar like al usuario:", error);
    res.status(500).json({ message: "Error al dar like al usuario. Inténtalo de nuevo más tarde." });
  }
};
