const { User, Device, VerificationToken } = require('../models');
const { generateToken } = require('../config/jwt');
const { sendVerificationEmail } = require('../utils/email');
const bcrypt = require('bcryptjs');


const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const { id: userId } = await User.create({ username, email, password });
    const { token } = await VerificationToken.create(userId);
    
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Registration successful. Please check your email for verification.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password, deviceName, deviceType } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_verified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    const { deviceId } = await Device.create(user.id, { deviceName, deviceType });
    const token = generateToken({ userId: user.id, deviceId });
    
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const verificationToken = await VerificationToken.findByToken(token);
    console.log("token used inside auth controller" + " " + token);

    if (!verificationToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(verificationToken.user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: 'User already verified' });
    }

    await VerificationToken.verify(token);

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
};



module.exports = { register, login, verifyEmail };