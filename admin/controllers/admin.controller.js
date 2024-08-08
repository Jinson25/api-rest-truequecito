const User = require('../../models/User');
const Product = require('../../models/Product');
const Role = require('../../models/Role');
const Exchange = require('../../models/Exchange');
const Info = require('../../models/Info');

// Usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editUser = async (req, res) => {
  const { username, email, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.username = username;
      user.email = email;
      user.role = role;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const { title, description, images, user } = req.body;
  try {
    const newProduct = new Product({ title, description, images, user });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editProduct = async (req, res) => {
  const { title, description, images } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.title = title;
      product.description = description;
      product.images = images;
      await product.save();
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.status(200).json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRole = async (req, res) => {
  const { name } = req.body;
  try {
    const newRole = new Role({ name });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editRole = async (req, res) => {
  const { name } = req.body;
  try {
    const role = await Role.findById(req.params.id);
    if (role) {
      role.name = name;
      await role.save();
      res.status(200).json(role);
    } else {
      res.status(404).json({ error: 'Rol no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role) {
      await role.remove();
      res.status(200).json({ message: 'Rol eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Rol no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener cantidad de usuarios
exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener cantidad de productos
exports.getProductCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener cantidad de roles
exports.getRoleCount = async (req, res) => {
  try {
    const count = await Role.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener cantidad de intercambios
exports.getExchangeCount = async (req, res) => {
  try {
    const count = await Exchange.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//informacion de truequecito
exports.getInfo = async (req, res) => {
  try {
    const info = await Info.findOne();
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la información' });
  }
};

exports.createInfo = async (req, res) => {
  try {
    const newInfo = new Info(req.body);
    await newInfo.save();
    res.status(201).json(newInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la información' });
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const updatedInfo = await Info.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la información' });
  }
};

exports.deleteInfo = async (req, res) => {
  try {
    await Info.findByIdAndDelete(req.params.id);
    res.json({ message: 'Información eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la información' });
  }
};