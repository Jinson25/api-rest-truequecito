const express = require('express');
const { uploadComprobante, handleUpload } = require('../controllers/uploadController');
const router = express.Router();

router.post('/upload', uploadComprobante, handleUpload);

module.exports = router;
