const express = require('express');
const router = express.Router();
const { register, login, findAllUsers } = require('../controllers/usersControllers.js');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, findAllUsers);

module.exports = router;