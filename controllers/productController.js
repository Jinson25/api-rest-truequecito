const Product = require('../models/Product');
const User = require('../models/User');
const Exchange = require('../models/Exchange'); // Importar el modelo Exchange

exports.createProduct = async (req, res) => {
  const { title, description, images, estado, preference } = req.body;
  try {
    if (!title || !description || !images) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const product = new Product({
      user: req.user.id,
      title,
      description,
      images,
      estado,
      preference,
      approved: true
    });
    await product.save();

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.products.push(product._id);
    await user.save();

    console.log('Producto creado correctamente:', product);

    res.status(201).json({ message: 'Producto creado correctamente', product });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  const searchTerm = req.query.search || '';
  try {
    // Obtener los productos que están en intercambios completados
    const completedExchanges = await Exchange.find({ status: 'completed' }).select('productOffered productRequested');
    const completedProductIds = completedExchanges.reduce((ids, exchange) => {
      ids.push(exchange.productOffered, exchange.productRequested);
      return ids;
    }, []);

    const query = searchTerm
      ? { _id: { $nin: completedProductIds }, approved: true, title: { $regex: searchTerm, $options: 'i' } }
      : { _id: { $nin: completedProductIds }, approved: true };

    console.log('Query:', query); // Mensaje de consola para verificar la consulta

    const products = await Product.find(query).populate('user', 'email username');

    console.log('Products found:', products.map(product => ({
      id: product._id,
      status: product.status,
      title: product.title
    }))); // Mensaje de consola para verificar los productos encontrados

    res.status(200).json(products);
  } catch (error) {
    console.error('Error in getProducts:', error.message); // Mensaje de consola para errores
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('user', 'email');
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
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
      res.status(200).json({ message: 'Producto actualizado correctamente' });
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

exports.registerExchange = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const user = await User.findById(product.user);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.exchanges += 1;
    await user.save();

    res.status(200).json({ message: 'Intercambio registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Nueva función para obtener productos del usuario autenticado
exports.getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  const { searchTerm } = req.params; 

  if (!searchTerm || typeof searchTerm !== 'string') {
    return res.status(400).json({ message: 'El término de búsqueda es requerido y debe ser una cadena de texto' });
  }

  try {
    // Búsqueda con normalización
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      approved: true,
      $or: [
        { title: { $regex: normalizedSearchTerm, $options: 'i' } },
        { description: { $regex: normalizedSearchTerm, $options: 'i' } }
      ]
    })
    .skip(skip)
    .limit(limit);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error en búsqueda de productos:', error);
    res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
};
