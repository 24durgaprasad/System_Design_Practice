import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth APIs
export const authAPI = {
    register: (data: { name: string; email: string; password: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

// Question APIs
export const questionAPI = {
    getAll: (params?: { category?: string; difficulty?: string; search?: string }) =>
        api.get('/questions', { params }),
    getById: (id: string) => api.get(`/questions/${id}`),
    create: (data: any) => api.post('/questions', data),
    update: (id: string, data: any) => api.put(`/questions/${id}`, data),
    delete: (id: string) => api.delete(`/questions/${id}`),
    seed: () => api.post('/questions/seed')
};

// Solution APIs
export const solutionAPI = {
    getAll: () => api.get('/solutions'),
    getByQuestion: (questionId: string) => api.get(`/solutions/question/${questionId}`),
    getById: (id: string) => api.get(`/solutions/${id}`),
    create: (data: { questionId: string; excalidrawData: any; excalidrawImage?: string }) =>
        api.post('/solutions', data),
    update: (id: string, data: { excalidrawData: any; excalidrawImage?: string }) =>
        api.put(`/solutions/${id}`, data),
    evaluate: (id: string) => api.post(`/solutions/${id}/evaluate`),
    delete: (id: string) => api.delete(`/solutions/${id}`)
};
