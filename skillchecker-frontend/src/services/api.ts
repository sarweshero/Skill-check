import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (data: { name: string; email: string; password: string; role?: string }) =>
        api.post('/auth/register', data),
};

// Admin API
export const adminApi = {
    // Student management
    createStudent: (data: { name: string; email: string; password: string; department?: string }) =>
        api.post('/admin/students', data),

    updateStudent: (id: number, data: { name?: string; email?: string; department?: string }) =>
        api.put(`/admin/students/${id}`, data),

    deleteStudent: (id: number) =>
        api.delete(`/admin/students/${id}`),

    // Skill management
    createSkill: (data: { name: string; description?: string; category?: string; maxLevel?: number }) =>
        api.post('/admin/skills', data),

    updateSkill: (id: number, data: { name?: string; description?: string; category?: string }) =>
        api.put(`/admin/skills/${id}`, data),

    // Evaluation
    evaluateStudent: (studentId: number, data: { skillId: number; score: number; feedback?: string }) =>
        api.post(`/admin/evaluate/${studentId}`, data),

    // Analytics
    getTopStudents: (limit?: number) =>
        api.get('/admin/top-students', { params: { limit } }),

    getSkillSummary: () =>
        api.get('/admin/skill-summary'),
};

// Student API
export const studentApi = {
    getProfile: () =>
        api.get('/student/me'),

    updateProfile: (data: { name?: string; department?: string; bio?: string }) =>
        api.put('/student/profile', data),

    submitEvidence: (data: FormData) =>
        api.post('/student/evidence', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    getCompetency: () =>
        api.get('/student/competency'),
};

// Skills API
export const skillsApi = {
    getAll: () =>
        api.get('/skills'),

    getById: (id: number) =>
        api.get(`/skills/${id}`),
};

export default api;
