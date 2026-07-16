/**
 * Centralised Axios instance.
 * Every API call in the app goes through this file so that:
 *  - Base URL is set once via env var
 *  - JWT token is injected automatically
 *  - 401 errors trigger logout once
 */
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor – attach token ────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('roh_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor – handle 401 globally ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid – clear auth state
      localStorage.removeItem('roh_token');
      localStorage.removeItem('roh_user');
      // Only redirect if not already on auth page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ── Content (public) ──────────────────────────────────────────────────────────
export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getOne: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  remove: (id) => api.delete(`/articles/${id}`),
};

export const videosAPI = {
  getAll: (params) => api.get('/videos', { params }),
  getOne: (id) => api.get(`/videos/${id}`),
  create: (data) => api.post('/videos', data),
  update: (id, data) => api.put(`/videos/${id}`, data),
  remove: (id) => api.delete(`/videos/${id}`),
};

export const podcastsAPI = {
  getAll: (params) => api.get('/podcasts', { params }),
  getOne: (id) => api.get(`/podcasts/${id}`),
  create: (data) => api.post('/podcasts', data),
  update: (id, data) => api.put(`/podcasts/${id}`, data),
  remove: (id) => api.delete(`/podcasts/${id}`),
};

export const expertsAPI = {
  getAll: (params) => api.get('/experts', { params }),
  getOne: (id) => api.get(`/experts/${id}`),
  create: (data) => api.post('/experts', data),
  update: (id, data) => api.put(`/experts/${id}`, data),
  remove: (id) => api.delete(`/experts/${id}`),
};

// ── User data (private) ───────────────────────────────────────────────────────
export const moodsAPI = {
  log: (data) => api.post('/moods', data),
  getHistory: (params) => api.get('/moods', { params }),
  remove: (id) => api.delete(`/moods/${id}`),
};

export const journalsAPI = {
  create: (data) => api.post('/journals', data),
  getAll: () => api.get('/journals'),
  getOne: (id) => api.get(`/journals/${id}`),
  update: (id, data) => api.put(`/journals/${id}`, data),
  remove: (id) => api.delete(`/journals/${id}`),
};

export const appointmentsAPI = {
  book: (data) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  getOne: (id) => api.get(`/appointments/${id}`),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export const chatAPI = {
  send: (message, history) => api.post('/chat', { message, history }),
};

export default api;
