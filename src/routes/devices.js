const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getDevices, logoutDevice } = require('../controllers/deviceController');

const router = express.Router();

router.get('/', authenticateToken, getDevices);
router.post('/:deviceId/logout', authenticateToken, logoutDevice);

module.exports = router;