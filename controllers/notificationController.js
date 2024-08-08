const Notification = require('../models/Notification');

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
    });
    await notification.save();

    res.status(201).json({ message: 'Exchange proposed successfully', exchange });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateExchangeStatus = async (req, res) => {
  const { exchangeId, status } = req.body;
  try {
    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    exchange.status = status;
    await exchange.save();

    // Crear notificaciones para ambos usuarios
    const userOffered = exchange.userOffered;
    const userRequested = exchange.userRequested;
    const message = status === 'accepted' ? 'Tu propuesta ha sido aceptada' : 'Tu propuesta ha sido rechazada';

    const notificationOffered = new Notification({
      userId: userOffered,
      message
    });
    await notificationOffered.save();

    const notificationRequested = new Notification({
      userId: userRequested,
      message
    });
    await notificationRequested.save();

    res.status(200).json({ message: `Exchange ${status} successfully`, uniqueCode: exchange.uniqueCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ timestamp: -1 });
    const notificationsWithId = notifications.map(notification => ({
      id: notification._id,
      message: notification.message,
      timestamp: notification.timestamp,
      read: notification.read,
    }));
    res.status(200).json(notificationsWithId);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
  
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to mark this notification as read' });
    }

    notification.read = true;
    await notification.save();


    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};
