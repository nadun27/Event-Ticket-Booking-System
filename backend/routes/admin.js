import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const bookingsFile = path.join(__dirname, '../data/bookings.json');
const eventsFile = path.join(__dirname, '../data/events.json');
const usersFile = path.join(__dirname, '../data/users.json');

// Admin dashboard stats
router.get('/dashboard', (req, res) => {
    try {
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        const bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

        const totalEvents = events.length;
        const totalBookings = bookings.length;
        const totalUsers = users.filter(u => u.role === 'user').length;
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

        res.json({
            success: true,
            stats: {
                totalEvents,
                totalBookings,
                totalUsers,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data'
        });
    }
});

export default router;