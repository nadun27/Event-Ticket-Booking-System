// routes/auth.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const TOKEN_TTL = '7d';

// ---------- helpers ----------
const ensureDataFiles = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
  }
};

const readUsers = () => {
  ensureDataFiles();
  const raw = fs.readFileSync(USERS_FILE, 'utf8') || '{}';
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.users) ? parsed.users : [];
};

const writeUsers = (users) => {
  ensureDataFiles();
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
};

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role || 'user',
  createdAt: u.createdAt,
});

// ---------- routes ----------

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const b = req.body || {};

    // Accept common field aliases from various forms
    const name =
      (b.name && String(b.name).trim()) ||
      [b.firstName, b.lastName].filter(Boolean).join(' ').trim() ||
      (b.fullName && String(b.fullName).trim()) ||
      (b.username && String(b.username).trim()) ||
      '';

    const email =
      (b.email && String(b.email).trim()) ||
      (b.emailAddress && String(b.emailAddress).trim()) ||
      '';

    const password = b.password || b.pass || b.confirmPassword || '';

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'name, email and password are required' });
    }

    const users = readUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const newUser = {
      id: uuid(),
      name: String(name),
      email: String(email).toLowerCase(),
      passwordHash,
      role: b.role === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign(
      { sub: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: TOKEN_TTL }
    );

    return res
      .status(201)
      .json({ success: true, user: publicUser(newUser), token });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const b = req.body || {};

    // Accept common aliases
    const email =
      (b.email && String(b.email).trim()) ||
      (b.emailAddress && String(b.emailAddress).trim()) ||
      '';
    const password = b.password || b.pass || '';

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'email and password are required' });
    }

    const users = readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_TTL }
    );

    return res.json({ success: true, user: publicUser(user), token });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res
      .status(500)
      .json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, error: 'Missing token' });

    const payload = jwt.verify(token, JWT_SECRET);
    const users = readUsers();
    const user = users.find((u) => u.id === payload.sub);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

module.exports = router;
