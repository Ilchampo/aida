import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

import AuthLoadingScreen from '@components/Auth/AuthLoadingScreen';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <AuthLoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
