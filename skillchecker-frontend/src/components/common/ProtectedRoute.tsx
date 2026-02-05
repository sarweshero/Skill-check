import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('ADMIN' | 'STUDENT')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
}) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login while preserving the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard if role doesn't match
        const redirectPath = user.role === 'ADMIN' ? '/admin' : '/student';
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
