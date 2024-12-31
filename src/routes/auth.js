const express = require('express');
const { body, param } = require('express-validator');
const { register, login, verifyEmail } = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists(),
  body('deviceName').exists(),
  body('deviceType').exists()
], login);

router.get('/verify/:token', [
  param('token').notEmpty().withMessage('Token is required')
], verifyEmail);

module.exports = router;
