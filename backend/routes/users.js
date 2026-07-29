import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const usersFile = path.join(__dirname, '../data/users.json');

// ✅ Get user profile
router.get('/profile/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const user = users.find(u => u.id === userId);

    if (user) {
      // strip password from response
      const { password, ...userWithoutPassword } = user;
      res.json({
        success: true,
        user: userWithoutPassword,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
    });
  }
});

// ✅ Update profile (name, phone, password change)
router.put('/profile/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const { name, phone, password, newPassword } = req.body;

    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 🔹 Update basic info
    if (name) users[userIndex].name = name;
    if (phone) users[userIndex].phone = phone;

    // 🔹 Handle password change
    if (password && newPassword) {
      if (users[userIndex].password === password) {
        users[userIndex].password = newPassword;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }
    }

    // Save updates
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    // Hide password in response
    const { password: _, ...updatedUser } = users[userIndex];
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
    });
  }
});

export default router;
