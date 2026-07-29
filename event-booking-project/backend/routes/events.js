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

// Get all events with filtering
router.get('/', (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, date } = req.query;
    const eventsData = readData('events.json');
    
    let events = eventsData.events;

    // Apply filters
    if (search) {
      events = events.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      events = events.filter(event => event.category === category);
    }

    if (minPrice) {
      events = events.filter(event => event.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      events = events.filter(event => event.price <= parseFloat(maxPrice));
    }

    if (date) {
      events = events.filter(event => event.date.startsWith(date));
    }

    res.json({ success: true, events });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get single event
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const eventsData = readData('events.json');
    const usersData = readData('users.json');
    
    const event = eventsData.events.find(e => e.id === id);
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Get organizer info
    const organizer = usersData.users.find(u => u.id === event.organizerId);
    const eventWithOrganizer = {
      ...event,
      organizer: organizer ? {
        id: organizer.id,
        name: `${organizer.firstName} ${organizer.lastName}`,
        email: organizer.email
      } : null
    };

    res.json({ success: true, event: eventWithOrganizer });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Create event (Organizer/Admin only)
router.post('/', (req, res) => {
  try {
    const eventData = req.body;
    const eventsData = readData('events.json');
    
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    eventsData.events.push(newEvent);
    writeData('events.json', eventsData);

    res.json({ success: true, event: newEvent });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update event
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    const eventsData = readData('events.json');
    
    const eventIndex = eventsData.events.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    eventsData.events[eventIndex] = {
      ...eventsData.events[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString()
    };

    writeData('events.json', eventsData);

    res.json({ success: true, event: eventsData.events[eventIndex] });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Delete event
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const eventsData = readData('events.json');
    
    const eventIndex = eventsData.events.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    eventsData.events.splice(eventIndex, 1);
    writeData('events.json', eventsData);

    res.json({ success: true, message: 'Event deleted successfully' });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;