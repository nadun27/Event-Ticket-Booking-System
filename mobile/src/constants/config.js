// ==========================
// 🌐 API Configuration
// ==========================

// 👇 Mobile devices need your LAN IP (not localhost)
export const API_BASE_URL = 'http://192.168.1.24:3005/api';
export const UPLOADS_BASE_URL = 'http://192.168.1.24:3005'; // for event images

// ==========================
// 📌 API Endpoints
// ==========================
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  EVENTS: {
    LIST: '/events',
    DETAILS: '/events',
    CREATE: '/events',
    UPDATE: '/events',
    DELETE: '/events',
    CATEGORIES: '/events/categories',
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    UPDATE: '/bookings',
    DELETE: '/bookings',
    USER_BOOKINGS: '/bookings/user',
    CONFIRM: '/bookings/confirm',
    CANCEL: '/bookings/cancel',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users',
    TICKETS: '/users/tickets',
  }
};

// ==========================
// 🎟️ Ticket Categories
// ==========================
export const TICKET_CATEGORIES = {
  REGULAR: 'regular',
  VIP: 'vip',
  PREMIUM: 'premium'
};

// ==========================
// 🎭 Event Categories
// ==========================
export const EVENT_CATEGORIES = {
  CONCERT: 'concert',
  MOVIE: 'movie',
  CONFERENCE: 'conference',
  SPORTS: 'sports',
  THEATER: 'theater',
  FESTIVAL: 'festival',
  WORKSHOP: 'workshop'
};

// ==========================
// 📌 Booking Statuses
// ==========================
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
};

// ==========================
// 👤 User Roles
// ==========================
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};
