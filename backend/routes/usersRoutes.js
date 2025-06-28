const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/usersControllers.js');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

module.exports = router;