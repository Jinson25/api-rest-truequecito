const Exchange = require('../models/Exchange');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Función para generar un código único
const generateUniqueCode = () => uuidv4().slice(0, 10).toUpperCase();

// Proponer un intercambio
exports.proposeExchange = async (req, res) => {
  const { productOffered, productRequested, userRequested } = req.body;
  try {
    const uniqueCode = generateUniqueCode();
    const exchange = new Exchange({
      productOffered,
      productRequested,
      userOffered: req.user.id,
      userRequested,
      uniqueCode
    });
    await exchange.save();

    // Crear notificación para el usuario solicitado
const notification = new Notification({
  userId: userRequested,
  message: 'Propuesta de intercambio recibida',
  timestamp: new Date(),
  read: false
});

    await notification.save();

    res.status(201).json({ message: 'Exchange proposed successfully', exchange });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aceptar intercambio
exports.acceptExchange = async (req, res) => {
  try {
    const { exchangeId } = req.params;

    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      return res.status(404).json({ message: 'Intercambio no encontrado' });
    }

    exchange.status = 'accepted';
    await exchange.save();

    res.status(200).json({ message: 'Intercambio completado correctamente', exchange });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
  // Rechazar intercambio
  exports.rejectExchange = async (req, res) => {
    const { exchangeId } = req.params;
    try {
      // Actualiza el estado del intercambio a "rejected"
      const exchange = await Exchange.findByIdAndUpdate(exchangeId, { status: 'rejected' }, { new: true });
  
      if (!exchange) {
        return res.status(404).json({ message: 'Exchange not found' });
      }
  
      // Envía notificación a los usuarios involucrados
      await sendNotificationToUsers(exchange, 'rejected');
  
      res.status(200).json({ message: 'Intercambio rechazado correctamente', exchange });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Función para enviar notificaciones a los usuarios involucrados
  async function sendNotificationToUsers(exchange, status) {
    const userOffered = await User.findById(exchange.userOffered);
    const userRequested = await User.findById(exchange.userRequested);
  
    if (userOffered && userRequested) {
      const message = `El intercambio fue ${status}`;
      const notifications = [
        new Notification({ userId: userOffered._id, message, timestamp: new Date(), read: false }),
        new Notification({ userId: userRequested._id, message, timestamp: new Date(), read: false })
      ];
  
      await Notification.insertMany(notifications);
    
    }
  }

// Obtener intercambios recibidos
exports.getReceivedExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({ userRequested: req.user.id, status: { $in: ['pending', 'accepted'] } })
      .populate('productOffered', 'title description images')
      .populate('productRequested', 'title description images')
      .populate('userOffered', 'username email')
      .populate('userRequested', 'username email');

    res.status(200).json(exchanges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener intercambios enviados
exports.getSentExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({ userOffered: req.user.id, status: { $in: ['pending', 'accepted'] } })
      .populate('productOffered', 'title description images')
      .populate('productRequested', 'title description images')
      .populate('userOffered', 'username email')
      .populate('userRequested', 'username email');

    res.status(200).json(exchanges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Subir comprobante
exports.uploadReceipt = async (req, res) => {
  const { exchangeId, userType, address, phoneNumber } = req.body;
  const file = req.file;

  try {
    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      return res.status(404).json({ message: 'Intercambio no encontrado' });
    }

    if (userType === 'requested') {
      exchange.receiptRequested = file.path;
      exchange.addressRequested = address;
      exchange.phoneRequested = phoneNumber;
    } else if (userType === 'offered') {
      exchange.receiptOffered = file.path;
      exchange.addressOffered = address;
      exchange.phoneOffered = phoneNumber;
    }

    if (!exchange.firstReceiptUploadedBy) {
      exchange.firstReceiptUploadedBy = req.user._id;
    }

    await exchange.save();

    if (exchange.receiptRequested && exchange.receiptOffered) {
      exchange.status = 'completed';
      await exchange.save();
 
      // Lógica para notificar al administrador
    } else {
      const otherUserId = userType === 'offered' ? exchange.userRequested : exchange.userOffered;
      const notification = new Notification({
        userId: otherUserId,
        message: 'Comprobante subido, te notificaremos cuando exista una actualización.',
        timestamp: new Date(),
        read: false
      });
      await notification.save();
    }

    res.status(200).json({ message: 'Comprobante cargado con éxito', exchange });
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar el comprobante', error: error.message });
  }
};

  //Obtener todos los intercabios
exports.getAllExchanges = async (req, res) => {
  try {
    // Verifica que el modelo Exchange esté correctamente configurado
    const exchanges = await Exchange.find()
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

    // Devuelve la respuesta exitosa con los intercambios
    res.status(200).json(exchanges);
  } catch (error) {
    // Log de error para depuración
    console.error('Error:', error.message);

    // Respuesta con error
    res.status(500).json({ error: 'Error, intentalo nuevamente' });
  }
};
// Obtener intercambios completados
exports.getCompletedExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({ status: 'completed' })
      .populate({
        path: 'productOffered',
        select: 'title description images estado preference',
      })
      .populate({
        path: 'productRequested',
        select: 'title description images estado preference',
      })
      .populate({
        path: 'userOffered',
        select: 'username email',
      })
      .populate({
        path: 'userRequested',
        select: 'username email',
      });

    res.status(200).json(exchanges);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error, intentalo nuevamente' });
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
      const message = `El intercambio fue ${status}`;
      const notifications = [
        new Notification({ userId: userOffered._id, message, timestamp: new Date(), read: false }),
        new Notification({ userId: userRequested._id, message, timestamp: new Date(), read: false })
      ];

      await Notification.insertMany(notifications);
    
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
    const exchange = await Exchange.findById(exchangeId)
      .populate('productOffered')
      .populate('productRequested');

    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    const userType = exchange.userOffered.toString() === req.user.id ? 'requested' : 'offered';
    res.json({ ...exchange.toObject(), userType });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }

};