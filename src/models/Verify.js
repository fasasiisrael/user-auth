const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class VerificationToken {
    static async create(userId) {
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
  
      const [result] = await pool.execute(
        'INSERT INTO verification_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
        [uuidv4(), userId, token, expiresAt]
      );
  
      return { token, result };
    }
  
    static async findByToken(token) {
      console.log( "token used inside model" + " "+ token);
      const [rows] = await pool.execute(
        'SELECT * FROM verification_tokens WHERE token = ?',
        [token]
       
      );
      return rows[0];
    }
  
    static async deleteByToken(token) {
      const [result] = await pool.execute(
        'DELETE FROM verification_tokens WHERE token = ?',
        [token]
      );
      return result;
    }
  
    static async verify(token) {
      const verificationToken = await this.findByToken(token);
  
      if (!verificationToken) {
        throw new Error('Invalid or expired token');
      }
  
      const now = new Date();
      if (new Date(verificationToken.expires_at) < now) {
        throw new Error('Token has expired');
      }
  
      const userId = verificationToken.user_id;
  
      const [updateResult] = await pool.execute(
        'UPDATE users SET is_verified = ? WHERE id = ?',
        [true, userId]
      );
  
      await this.deleteByToken(token);
  
      return updateResult;
    }
  }

  module.exports = VerificationToken;
