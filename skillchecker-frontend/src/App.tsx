import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/hooks/useToast';
import { useAuthStore } from '@/store/authStore';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Common Components
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Public Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Student Pages
import StudentDashboard from '@/pages/student/Dashboard';
import StudentProfile from '@/pages/student/Profile';
import StudentEvidence from '@/pages/student/Evidence';
import StudentCompetency from '@/pages/student/Competency';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminStudents from '@/pages/admin/Students';
import AdminSkills from '@/pages/admin/Skills';
import AdminEvaluate from '@/pages/admin/Evaluate';
import AdminAnalytics from '@/pages/admin/Analytics';

const App: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />

                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected Student Routes */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                    <Route path="/student/evidence" element={<StudentEvidence />} />
                    <Route path="/student/competency" element={<StudentCompetency />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<AdminStudents />} />
                    <Route path="/admin/skills" element={<AdminSkills />} />
                    <Route path="/admin/evaluate" element={<AdminEvaluate />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/students/:id" element={<StudentProfile />} />
                </Route>

                {/* Catch-all redirect */}
                <Route
                    path="*"
                    element={
                        isAuthenticated ? (
                            <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Routes>
            <Toaster />
        </Router>
    );
};

export default App;
