const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Helper functions
const readData = (filename) => {
  const filePath = path.join(__dirname, '../data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeData = (filename, data) => {
  const filePath = path.join(__dirname, '../data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Get all users (Admin only)
router.get('/', (req, res) => {
  try {
    const usersData = readData('users.json');
    
    // Remove passwords from response
    const usersWithoutPasswords = usersData.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({ success: true, users: usersWithoutPasswords });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const usersData = readData('users.json');
    
    const user = usersData.users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update user role (Admin only)
router.put('/:id/role', (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role. Must be user, organizer, or admin' 
      });
    }

    const usersData = readData('users.json');
    const userIndex = usersData.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    usersData.users[userIndex].role = role;
    usersData.users[userIndex].updatedAt = new Date().toISOString();
    
    writeData('users.json', usersData);

    const { password, ...userWithoutPassword } = usersData.users[userIndex];
    res.json({ success: true, user: userWithoutPassword });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;