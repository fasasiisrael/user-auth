const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const [result] = await pool.execute(
      'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
      [userId, username, email, hashedPassword]
    );
    
    return { id: userId, result };
  }


static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, profile_image FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
  static async updateProfile(userId, { username, email, profileImage }) {
    if (!username && !email && !profileImage) {
      throw new Error('No fields provided for update');
    }
  
    const updates = [];
    const params = [];
  
    if (username) {
      updates.push('username = ?');
      params.push(username);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (profileImage) {
      updates.push('profile_image = ?');
      params.push(profileImage);
    }
  
    params.push(userId);
  
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = ?
    `;
  
    console.log('Generated Query:', query);
    console.log('Query Parameters:', params);
  
    try {
      const [result] = await pool.execute(query, params);
      console.log('Database Update Result:', result);
      return result;
    } catch (error) {
      console.error('Database Update Error:', error);
      throw error;
    }
  }
  
  

}

module.exports = User;
