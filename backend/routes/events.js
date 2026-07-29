import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialEvents } from '../data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const eventsFile = path.join(__dirname, '../data/events.json');

// Initialize events data if empty
const initializeEvents = () => {
    if (fs.existsSync(eventsFile)) {
        const data = fs.readFileSync(eventsFile, 'utf8');
        const events = JSON.parse(data);
        if (events.length === 0) {
            fs.writeFileSync(eventsFile, JSON.stringify(initialEvents, null, 2));
        }
    }
};

initializeEvents();

// Get all events
router.get('/', (req, res) => {
    try {
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        res.json({
            success: true,
            events: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events'
        });
    }
});

// Get single event
router.get('/:id', (req, res) => {
    try {
        const eventId = req.params.id;
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        const event = events.find(e => e.id === eventId);

        if (event) {
            res.json({
                success: true,
                event: event
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching event'
        });
    }
});

// Create new event (Admin only)
router.post('/', (req, res) => {
    try {
        const { title, description, date, time, venue, price, availableTickets, image, category, organizer } = req.body;

        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));

        const newEvent = {
            id: (events.length + 1).toString(),
            title,
            description,
            date,
            time,
            venue,
            price: parseInt(price),
            availableTickets: parseInt(availableTickets),
            image: image || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
            category: category || 'General',
            organizer: organizer || 'Event Organizer',
            createdAt: new Date().toISOString()
        };

        events.push(newEvent);
        fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));

        res.json({
            success: true,
            message: 'Event created successfully',
            event: newEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating event'
        });
    }
});

// Update event (Admin only)
router.put('/:id', (req, res) => {
    try {
        const eventId = req.params.id;
        const updates = req.body;

        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        const eventIndex = events.findIndex(e => e.id === eventId);

        if (eventIndex !== -1) {
            events[eventIndex] = { ...events[eventIndex], ...updates };
            fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));

            res.json({
                success: true,
                message: 'Event updated successfully',
                event: events[eventIndex]
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating event'
        });
    }
});

// Delete event (Admin only)
router.delete('/:id', (req, res) => {
    try {
        const eventId = req.params.id;
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
        const filteredEvents = events.filter(e => e.id !== eventId);

        if (filteredEvents.length < events.length) {
            fs.writeFileSync(eventsFile, JSON.stringify(filteredEvents, null, 2));
            res.json({
                success: true,
                message: 'Event deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting event'
        });
    }
});

export default router;