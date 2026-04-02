const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Estas rutas se completan con el prefijo /api/auth definido en index.js
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;