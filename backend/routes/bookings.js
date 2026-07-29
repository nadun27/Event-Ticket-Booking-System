import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const bookingsFile = path.join(__dirname, '../data/bookings.json');
const eventsFile = path.join(__dirname, '../data/events.json');

// Initialize bookings file if empty
if (fs.existsSync(bookingsFile)) {
    const data = fs.readFileSync(bookingsFile, 'utf8');
    const bookings = JSON.parse(data);
    if (bookings.length === 0) {
        fs.writeFileSync(bookingsFile, JSON.stringify([], null, 2));
    }
}

// Create new booking
router.post('/', (req, res) => {
    try {
        const { eventId, userId, tickets, totalPrice } = req.body;

        // Read events to check availability
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        const event = events.find(e => e.id === eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.availableTickets < tickets) {
            return res.status(400).json({
                success: false,
                message: 'Not enough tickets available'
            });
        }

        // Update event tickets
        event.availableTickets -= tickets;
        fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));

        // Create booking
        const bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));

        const newBooking = {
            id: (bookings.length + 1).toString(),
            eventId,
            userId,
            tickets: parseInt(tickets),
            totalPrice: parseFloat(totalPrice),
            bookingDate: new Date().toISOString(),
            status: 'confirmed',
            eventDetails: {
                title: event.title,
                date: event.date,
                time: event.time,
                venue: event.venue,
                image: event.image
            }
        };

        bookings.push(newBooking);
        fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

        res.json({
            success: true,
            message: 'Booking created successfully',
            booking: newBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking'
        });
    }
});

// Get user's bookings
router.get('/user/:userId', (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
        const userBookings = bookings.filter(b => b.userId === userId);

        res.json({
            success: true,
            bookings: userBookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
});

// Get all bookings (Admin only)
router.get('/', (req, res) => {
    try {
        const bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
        res.json({
            success: true,
            bookings: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
});

// Cancel booking
router.put('/:id/cancel', (req, res) => {
    try {
        const bookingId = req.params.id;
        const bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8'));
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);

        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'cancelled';
            fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

            res.json({
                success: true,
                message: 'Booking cancelled successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking'
        });
    }
});

export default router;