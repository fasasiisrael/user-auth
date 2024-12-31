const { User } = require('../models');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const fs = require('fs');


const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  let profileImage = null;

  try {
    if (req.file) {
      profileImage = req.file.buffer.toString('base64');
    }

    if (!username && !email && !profileImage) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    console.log('Updating profile for user:', req.user.userId, {
      username,
      email,
      profileImage: profileImage ? profileImage.slice(0, 30) + '...' : null,
    });

    await User.updateProfile(req.user.userId, { username, email, profileImage });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Failed to update profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};



module.exports = { getProfile, updateProfile };