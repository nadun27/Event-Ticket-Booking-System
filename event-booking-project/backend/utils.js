import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

// Ensure data directory and files exist
const initializeDataFiles = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const defaultFiles = {
    [USERS_FILE]: [
      {
        "id": "U001",
        "username": "john_doe",
        "email": "john@example.com",
        "password": "password123",
        "name": "John Doe",
        "phone": "+1234567890",
        "role": "user",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    [EVENTS_FILE]: [
      {
        "id": "E001",
        "title": "Summer Music Festival 2024",
        "description": "Annual summer music festival featuring top international artists.",
        "date": "2024-08-15",
        "time": "18:00",
        "venue": "Central Park Amphitheater",
        "image": "/images/summer-festival.jpg",
        "ticketPrice": 75,
        "vipPrice": 150,
        "availableTickets": 250,
        "category": "Music",
        "createdAt": "2024-01-10T08:00:00.000Z",
        "status": "active"
      }
    ],
    [BOOKINGS_FILE]: [
      {
        "id": "B001",
        "userId": "U001",
        "eventId": "E001",
        "eventTitle": "Summer Music Festival 2024",
        "eventDate": "2024-08-15",
        "eventTime": "18:00",
        "eventVenue": "Central Park Amphitheater",
        "ticketType": "vip",
        "quantity": 2,
        "totalAmount": 300,
        "bookingDate": "2024-01-20T14:30:00.000Z",
        "status": "confirmed",
        "bookingReference": "REF-20240120143000"
      }
    ],
    [ADMIN_FILE]: { 
      username: 'admin', 
      password: 'admin123' 
    }
  };

  Object.entries(defaultFiles).forEach(([filePath, defaultData]) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      console.log(`Created ${filePath}`);
    }
  });
};

// Generate unique IDs in U001, E001, B001 format
const generateId = (prefix, existingItems) => {
  if (!existingItems || existingItems.length === 0) {
    return `${prefix}001`;
  }

  const existingIds = existingItems
    .map(item => item.id)
    .filter(id => id.startsWith(prefix))
    .map(id => parseInt(id.replace(prefix, '')))
    .filter(num => !isNaN(num));

  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const newNumber = maxId + 1;
  
  return `${prefix}${newNumber.toString().padStart(3, '0')}`;
};

// Read data from file
const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Write data to file
const writeData = (filePath, data) => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// Initialize data files when this module is imported
initializeDataFiles();

export {
  initializeDataFiles,
  generateId,
  readData,
  writeData,
  USERS_FILE,
  EVENTS_FILE,
  BOOKINGS_FILE,
  ADMIN_FILE
};