import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { initialUsers } from '../data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const usersFile = path.join(__dirname, '../data/users.json');

// Initialize users data if empty
const initializeUsers = () => {
    if (fs.existsSync(usersFile)) {
        const data = fs.readFileSync(usersFile, 'utf8');
        const users = JSON.parse(data);
        if (users.length === 0) {
            fs.writeFileSync(usersFile, JSON.stringify(initialUsers, null, 2));
        }
    }
};

initializeUsers();

const JWT_SECRET = 'your-secret-key-change-in-production';

// Login endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            },
            token
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

// Register endpoint
router.post('/register', (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and password are required'
        });
    }

    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({
            success: false,
            message: 'User already exists with this email'
        });
    }

    const newUser = {
        id: (users.length + 1).toString(),
        name,
        email,
        password, // In production, hash this password
        phone: phone || '',
        role: 'user',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        success: true,
        message: 'Registration successful',
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone
        },
        token
    });
});

export default router;