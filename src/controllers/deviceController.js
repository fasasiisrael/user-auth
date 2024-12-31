const { Device } = require('../models');

const getDevices = async (req, res) => {
  try {
    const devices = await Device.getActiveDevices(req.user.userId); 
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error); 
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

const logoutDevice = (req, res) => {
  const { deviceId } = req.params;

  try {
    const result = Device.logout(deviceId, req.user.userId);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Device logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout device' });
  }
};

module.exports = { getDevices, logoutDevice };