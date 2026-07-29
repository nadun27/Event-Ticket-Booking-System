import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initialEvents = [
    {
        id: '1',
        title: 'Music Festival 2024',
        description: 'Annual music festival featuring top artists',
        date: '2024-12-25',
        time: '18:00',
        venue: 'Central Park',
        price: 75,
        availableTickets: 150,
        image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
        category: 'Music',
        organizer: 'Event Pro',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Tech Conference',
        description: 'Latest technology trends and innovations',
        date: '2024-11-15',
        time: '09:00',
        venue: 'Convention Center',
        price: 120,
        availableTickets: 200,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        category: 'Technology',
        organizer: 'Tech Events Inc',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Food & Wine Expo',
        description: 'Gourmet food and wine tasting event',
        date: '2024-10-20',
        time: '14:00',
        venue: 'Exhibition Hall',
        price: 60,
        availableTickets: 80,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
        category: 'Food & Drink',
        organizer: 'Culinary Arts',
        createdAt: new Date().toISOString()
    }
];

export const initialUsers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123', // In real app, this should be hashed
        phone: '+1234567890',
        role: 'user',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        phone: '+1234567891',
        role: 'admin',
        createdAt: new Date().toISOString()
    }
];