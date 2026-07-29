// services/api.js

// Read API base URL from Vite env (.env) or fall back to '/api' (use Vite proxy in dev)
const API_BASE_URL = (import.meta.env?.VITE_API_URL || '/api').replace(/\/+$/, '');

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${path}`;

    const headers = { ...(options.headers || {}) };

    // Only set JSON Content-Type if body is not FormData and header not already provided
    const isFormData = (options.body && typeof FormData !== 'undefined' && options.body instanceof FormData);
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Auth token
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;

    const config = {
      ...options,
      headers,
    };

    try {
      const res = await fetch(url, config);

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      // Handle empty responses gracefully
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return null;

      return await res.json();
    } catch (err) {
      console.error('API request failed:', err);
      throw err;
    }
  }

  // 🔐 Auth endpoints
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 🎟 Events endpoints
  getEvents(filters = {}) {
    const qs = new URLSearchParams(filters).toString();
    const suffix = qs ? `?${qs}` : '';
    return this.request(`/events${suffix}`);
  }

  getEvent(id) {
    return this.request(`/events/${id}`);
  }

  createEvent(eventData) {
    const isForm = eventData instanceof FormData;
    return this.request('/events', {
      method: 'POST',
      body: isForm ? eventData : JSON.stringify(eventData),
    });
  }

  updateEvent(id, eventData) {
    const isForm = eventData instanceof FormData;
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: isForm ? eventData : JSON.stringify(eventData),
    });
  }

  deleteEvent(id) {
    return this.request(`/events/${id}`, { method: 'DELETE' });
  }

  // 🛒 Orders endpoints
  createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  getOrders() {
    return this.request('/orders');
  }

  getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  // 👤 User endpoints
  getProfile() {
    return this.request('/users/profile');
  }

  updateProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // 🛠 Admin endpoints
  getDashboardStats() {
    return this.request('/admin/dashboard');
  }

  getUsers() {
    return this.request('/admin/users');
  }

  updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }
}

export default new ApiService();
