const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usersControllers.js');
const validateLogin = require('../middleware/validateLogin');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register', UserController.register);
router.post('/login', validateLogin, UserController.login);

router.post('/', authenticateToken, UserController.createUser);
router.get('/', authenticateToken, UserController.findAllUsers);
router.get('/:id', authenticateToken, UserController.findUserById);
router.get('/:id/orders', authenticateToken, UserController.findOrdersByUserId);
router.put('/:id', authenticateToken, UserController.updateUser);
router.delete('/:id', authenticateToken, UserController.deleteUser);

module.exports = router;