import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { data } from 'react-router-dom';

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
    createStudent: (data: { name: string; email: string; password: string; dept?: string; active?: boolean }) =>
        api.post('/admin/students', data),

    getAllStudents: (active?: boolean) =>
        api.get('/admin/students', { params: { active } }),

    getStudentProfile: (id: number | string) =>
        api.get(`/admin/students/${id}`),

    updateStudent: (id: number, data: { name?: string; email?: string; dept?: string; active?: boolean }) =>
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
    getProfile: (id?: string | number) =>
        api.get(id ? `/student/${id}` : '/student/me'),

    updateProfile: (data: {
        name?: string;
        dept?: string;
        bio?: string;
        githubUrl?: string | null;
        linkedinUrl?: string | null;
        portfolioUrl?: string | null;
        resumeUrl?: string | null;
        cgpa?: number | null;
        graduationYear?: number | null;
        yearOfStudy?: number | null;
        profilePictureUrl?: string | null;
    }) =>
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
