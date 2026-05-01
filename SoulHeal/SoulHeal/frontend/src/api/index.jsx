import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('soulheal_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('soulheal_token');
      localStorage.removeItem('soulheal_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/update-profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// Mood
export const moodAPI = {
  create: (data) => API.post('/moods', data),
  getAll: (params) => API.get('/moods', { params }),
  getAnalytics: () => API.get('/moods/analytics'),
  getById: (id) => API.get(`/moods/${id}`),
  update: (id, data) => API.put(`/moods/${id}`, data),
  delete: (id) => API.delete(`/moods/${id}`),
  getStudentMoods: (studentId) => API.get(`/moods/student/${studentId}`),
};

// Assessment
export const assessmentAPI = {
  submit: (data) => API.post('/assessments', data),
  getAll: () => API.get('/assessments'),
  getById: (id) => API.get(`/assessments/${id}`),
  delete: (id) => API.delete(`/assessments/${id}`),
  getStudentAssessments: (studentId) => API.get(`/assessments/student/${studentId}`),
};

// Appointments
export const appointmentAPI = {
  book: (data) => API.post('/appointments', data),
  getMy: () => API.get('/appointments/my'),
  getCounselorAppointments: (params) => API.get('/appointments/counselor', { params }),
  getAll: () => API.get('/appointments'),
  update: (id, data) => API.put(`/appointments/${id}`, data),
  cancel: (id) => API.delete(`/appointments/${id}`),
};

// Resources
export const resourceAPI = {
  getAll: (params) => API.get('/resources', { params }),
  getById: (id) => API.get(`/resources/${id}`),
  create: (data) => API.post('/resources', data),
  update: (id, data) => API.put(`/resources/${id}`, data),
  delete: (id) => API.delete(`/resources/${id}`),
};

// Admin
export const adminAPI = {
  getCounselors: () => API.get('/admin/counselors'),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleStatus: (id) => API.put(`/admin/users/${id}/toggle-status`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getAnalytics: () => API.get('/admin/analytics'),
};

export default API;
