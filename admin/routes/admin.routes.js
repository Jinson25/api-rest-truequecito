const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const adminMiddleware = require('../middleware/admin.middleware');
const router = express.Router();

// Usuarios
router.get('/users',  adminController.getAllUsers);
router.post('/users',  adminController.createUser);
router.put('/users/:id', adminController.editUser);
router.delete('/users/:id', adminController.deleteUser);

// Productos
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id',  adminController.editProduct);
router.delete('/products/:id',  adminController.deleteProduct);

// Roles
router.get('/roles',  adminController.getAllRoles);
router.post('/roles',  adminController.createRole);
router.put('/roles/:id',  adminController.editRole);
router.delete('/roles/:id',  adminController.deleteRole);

router.get('/user-count', adminController.getUserCount);
router.get('/product-count', adminController.getProductCount);
router.get('/role-count', adminController.getRoleCount);
router.get('/exchange-count', adminController.getExchangeCount);

router.get('/info/', adminController.getInfo);
router.post('/info/', adminController.createInfo);
router.put('/info/:id', adminController.updateInfo);
router.delete('/info/:id', adminController.deleteInfo);


module.exports = router;