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

// Create booking
router.post('/', (req, res) => {
  try {
    const { userId, events, total, paymentMethod } = req.body;
    const bookingsData = readData('bookings.json');
    const eventsData = readData('events.json');

    // Validate event availability and update tickets
    for (const bookingEvent of events) {
      const event = eventsData.events.find(e => e.id === bookingEvent.eventId);
      if (!event) {
        return res.status(404).json({ 
          success: false, 
          error: `Event ${bookingEvent.eventId} not found` 
        });
      }

      if (event.availableTickets < bookingEvent.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Not enough tickets available for ${event.title}` 
        });
      }

      // Update available tickets
      event.availableTickets -= bookingEvent.quantity;
    }

    const newBooking = {
      id: `BKG-${Date.now()}`,
      userId,
      events,
      total,
      paymentMethod,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    bookingsData.bookings.push(newBooking);
    writeData('bookings.json', bookingsData);
    writeData('events.json', eventsData); // Save updated events

    res.json({ success: true, booking: newBooking });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get user bookings
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const bookingsData = readData('bookings.json');
    const eventsData = readData('events.json');

    const userBookings = bookingsData.bookings
      .filter(booking => booking.userId === userId)
      .map(booking => {
        // Add event details to each booking
        const bookingWithEvents = {
          ...booking,
          eventDetails: booking.events.map(bookingEvent => {
            const event = eventsData.events.find(e => e.id === bookingEvent.eventId);
            return {
              ...bookingEvent,
              event: event || null
            };
          })
        };
        return bookingWithEvents;
      });

    res.json({ success: true, bookings: userBookings });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get all bookings (Admin only)
router.get('/', (req, res) => {
  try {
    const bookingsData = readData('bookings.json');
    const eventsData = readData('events.json');
    const usersData = readData('users.json');

    const bookingsWithDetails = bookingsData.bookings.map(booking => {
      const user = usersData.users.find(u => u.id === booking.userId);
      return {
        ...booking,
        user: user ? { 
          id: user.id, 
          name: `${user.firstName} ${user.lastName}`,
          email: user.email 
        } : null,
        eventDetails: booking.events.map(bookingEvent => {
          const event = eventsData.events.find(e => e.id === bookingEvent.eventId);
          return {
            ...bookingEvent,
            event: event || null
          };
        })
      };
    });

    res.json({ success: true, bookings: bookingsWithDetails });

  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;