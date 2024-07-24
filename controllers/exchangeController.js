const Exchange = require('../models/Exchange');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Función para generar un código único
const generateUniqueCode = () => uuidv4().slice(0, 10).toUpperCase();

// Proponer un intercambio
exports.proposeExchange = async (req, res) => {
  const { productOffered, productRequested } = req.body;
  try {
    const uniqueCode = generateUniqueCode();
    console.log('Generated unique code:', uniqueCode);
    const exchange = new Exchange({
      productOffered,
      productRequested,
      userOffered: req.user.id,
      userRequested: req.body.userRequested,
      uniqueCode
    });
    await exchange.save();
    console.log('Exchange created with unique code:', uniqueCode);
    res.status(201).json({ message: 'Exchange proposed successfully', exchange });
  } catch (error) {
    console.error('Error proposing exchange:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener intercambios recibidos
exports.getReceivedExchanges = async (req, res) => {
  try {
    console.log('Fetching received exchanges for user:', req.user.id);
    const exchanges = await Exchange.find({ userRequested: req.user.id, status: { $in: ['pending', 'accepted'] } })
      .populate({
        path: 'productOffered',
        select: 'title description images',
      })
      .populate({
        path: 'productRequested',
        select: 'title description images',
      })
      .populate({
        path: 'userOffered',
        select: 'username email',
      })
      .populate({
        path: 'userRequested',
        select: 'username email',
      });

    const formattedExchanges = exchanges.map(exchange => ({
      ...exchange._doc,
      productOffered: {
        ...exchange._doc.productOffered._doc,
        image: exchange._doc.productOffered.images[0]
      },
      productRequested: {
        ...exchange._doc.productRequested._doc,
        image: exchange._doc.productRequested.images[0]
      }
    }));

    console.log('Received exchanges fetched:', formattedExchanges);
    res.status(200).json(formattedExchanges);
  } catch (error) {
    console.error('Error fetching received exchanges:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener intercambios enviados
exports.getSentExchanges = async (req, res) => {
  try {
    console.log('Fetching sent exchanges for user:', req.user.id);
    const exchanges = await Exchange.find({ userOffered: req.user.id, status: { $in: ['pending', 'accepted'] } })
      .populate({
        path: 'productOffered',
        select: 'title description images',
      })
      .populate({
        path: 'productRequested',
        select: 'title description images',
      })
      .populate({
        path: 'userOffered',
        select: 'username email',
      })
      .populate({
        path: 'userRequested',
        select: 'username email',
      });

    const formattedExchanges = exchanges.map(exchange => ({
      ...exchange._doc,
      productOffered: {
        ...exchange._doc.productOffered._doc,
        image: exchange._doc.productOffered.images[0]
      },
      productRequested: {
        ...exchange._doc.productRequested._doc,
        image: exchange._doc.productRequested.images[0]
      }
    }));

    console.log('Sent exchanges fetched:', formattedExchanges);
    res.status(200).json(formattedExchanges);
  } catch (error) {
    console.error('Error fetching sent exchanges:', error);
    res.status(500).json({ error: error.message });
  }
};


// Actualizar estado del intercambio
exports.updateExchangeStatus = async (req, res) => {
  const { exchangeId, status } = req.body;
  try {
    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }
    if (exchange.userRequested.toString() !== req.user.id && exchange.userOffered.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this exchange' });
    }
    exchange.status = status;
    await exchange.save();

    // Notificar a los usuarios
    const userOffered = await User.findById(exchange.userOffered);
    const userRequested = await User.findById(exchange.userRequested);

    if (userOffered && userRequested) {
      console.log(`Notificando a ${userOffered.email} y ${userRequested.email} que el intercambio fue ${status}`);
      // Aquí puedes agregar lógica para enviar un correo o notificación
    }

    res.status(200).json({ message: `Exchange ${status} successfully`, uniqueCode: exchange.uniqueCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener intercambio por ID
exports.getExchangeById = async (req, res) => {
  try {
    const exchangeId = req.params.exchangeId;
    console.log('Fetching exchange with ID:', exchangeId);
    const exchange = await Exchange.findById(exchangeId)
      .populate('productOffered')
      .populate('productRequested');

    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    console.log('Exchange fetched:', exchange);
    console.log('Exchange unique code:', exchange.uniqueCode);
    res.json(exchange);
  } catch (error) {
    console.error('Error fetching exchange:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Subir comprobante
exports.uploadReceipt = async (req, res) => {
  const { exchangeId, userType } = req.body;
  const file = req.file;

  try {
    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      return res.status(404).json({ message: 'Intercambio no encontrado' });
    }

    if (userType === 'offered') {
      exchange.receiptOffered = file.path;
    } else if (userType === 'requested') {
      exchange.receiptRequested = file.path;
    }

    await exchange.save();

    // Notificar al otro usuario si ambos comprobantes han sido cargados
    if (exchange.receiptOffered && exchange.receiptRequested) {
      // Notificación al administrador
      console.log('Ambos comprobantes cargados, notificar al administrador.');
      // Aquí puedes agregar la lógica para notificar al administrador
    }

    res.status(200).json({ message: 'Comprobante cargado con éxito', exchange });
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar el comprobante', error: error.message });
  }
};
