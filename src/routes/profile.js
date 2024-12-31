const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profileController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get('/', authenticateToken, getProfile);

router.put('/', authenticateToken, upload.single('profileImage'), updateProfile);

module.exports = router;
