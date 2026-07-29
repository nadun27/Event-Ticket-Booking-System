import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../constants/config';
import { retrieveToken, clearStorage } from './storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token
api.interceptors.request.use(async (config) => {
  try {
    const token = await retrieveToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (err) {
    console.error('Error adding auth token:', err);
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    console.error('API Error:', err.response?.data || err.message);
    if (err.response?.status === 401) await clearStorage();
    return Promise.reject(err);
  }
);

// ✅ Safe data extractor (avoids reduce errors)
const normalizeResponse = (res) => {
  if (!res?.data) return [];
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data.events)) return res.data.events;
  return [];
};

// ===== API METHODS =====

// Events
export const getEvents = async () => {
  const res = await api.get(ENDPOINTS.EVENTS.LIST);
  return normalizeResponse(res);
};

export const getEventById = async (id) => {
  const res = await api.get(`${ENDPOINTS.EVENTS.DETAILS}/${id}`);
  return res?.data || null;
};

// Auth
export const login = (email, password) => api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
export const register = (data) => api.post(ENDPOINTS.AUTH.REGISTER, data);
export const logout = () => api.post(ENDPOINTS.AUTH.LOGOUT);
export const getProfile = () => api.get(ENDPOINTS.AUTH.PROFILE);

// Bookings
export const getBookings = async () => {
  const res = await api.get(ENDPOINTS.BOOKINGS.LIST);
  return normalizeResponse(res);
};

export const getUserBookings = async () => {
  const res = await api.get(ENDPOINTS.BOOKINGS.USER_BOOKINGS);
  return normalizeResponse(res);
};

export default api;
