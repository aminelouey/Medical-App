const express = require('express');
const router = express.Router();
console.log('Auth Routes file loaded');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

console.log('Auth Router Stack Size:', router.stack.length);

module.exports = router;
