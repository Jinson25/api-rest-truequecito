const express = require('express');
const { createPayment, getPayments } = require('../controllers/paymentController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createPayment);
router.get('/', authMiddleware, getPayments);

module.exports = router;
