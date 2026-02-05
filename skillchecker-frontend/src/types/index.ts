// User types
export interface User {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'STUDENT';
}

export interface Student {
    id: number;
    name: string;
    email: string;
    department?: string;
    enrollmentDate?: string;
    competencyScore?: number;
}

export interface StudentProfile {
    id: number;
    name: string;
    email: string;
    department?: string;
    bio?: string;
    avatarUrl?: string;
}

// Skill types
export interface Skill {
    id: number;
    name: string;
    description?: string;
    category?: string;
    maxLevel?: number;
}

export interface SkillProgress {
    skillId: number;
    skillName: string;
    currentLevel: number;
    maxLevel: number;
    percentage: number;
}

// Competency types
export interface Competency {
    skillId: number;
    skillName: string;
    level: number;
    score: number;
    evaluatedAt?: string;
}

export interface CompetencyData {
    competencies: Competency[];
    overallScore: number;
    lastUpdated?: string;
}

// Evidence types
export interface Evidence {
    id: number;
    skillId: number;
    skillName?: string;
    description: string;
    fileUrl?: string;
    submittedAt: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface EvidenceSubmission {
    skillId: number;
    description: string;
    file?: File;
}

// Analytics types
export interface TopStudent {
    id: number;
    name: string;
    email: string;
    department?: string;
    totalScore: number;
    rank: number;
}

export interface SkillSummary {
    skillId: number;
    skillName: string;
    averageScore: number;
    totalStudents: number;
    distribution: {
        level: number;
        count: number;
    }[];
}

// Authentication types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'STUDENT';
}

export interface AuthResponse {
    token: string;
    user: User;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Evaluation types
export interface Evaluation {
    studentId: number;
    skillId: number;
    score: number;
    feedback?: string;
}

// Chart data types
export interface RadarChartData {
    skill: string;
    value: number;
    fullMark: number;
}

export interface PieChartData {
    name: string;
    value: number;
    color: string;
}

export interface ProgressData {
    name: string;
    value: number;
    max: number;
    color?: string;
}
