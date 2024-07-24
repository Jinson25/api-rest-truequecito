const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  const { amount } = req.body;
  try {
    const payment = new Payment({
      user: req.user.id,
      amount
    });
    await payment.save();
    res.status(201).json({ message: 'Payment created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
