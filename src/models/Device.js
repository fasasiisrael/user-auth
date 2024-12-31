const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Device {
  static async create(userId, { deviceName, deviceType }) {
    const deviceId = uuidv4();
    const [result] = await pool.execute(
      'INSERT INTO devices (id, user_id, device_name, device_type) VALUES (?, ?, ?, ?)',
      [deviceId, userId, deviceName, deviceType]
    );
    
    return { deviceId, result };
  }

  static async getActiveDevices(userId) {
    const [rows] = await pool.execute(
      'SELECT id, device_name, device_type, last_login FROM devices WHERE user_id = ? AND is_active = 1',
      [userId]
    );
    return rows;
  }

  static async logout(deviceId, userId) {
    const [result] = await pool.execute(
      'UPDATE devices SET is_active = FALSE WHERE id = ? AND user_id = ?',
      [deviceId, userId]
    );
    return result;
  }
}

module.exports = Device;