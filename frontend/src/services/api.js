import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const resumeAPI = {
  analyze: (formData, onProgress) =>
    api.post('/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    }),

  getHistory: (params = {}) => api.get('/resume/history', { params }),

  getById: (id) => api.get(`/resume/${id}`),

  deleteAnalysis: (id) => api.delete(`/resume/${id}`),

  getStats: () => api.get('/resume/stats'),
};

export default api;
