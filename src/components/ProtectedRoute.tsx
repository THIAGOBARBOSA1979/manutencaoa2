
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'client';
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole = 'admin',
  redirectTo 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated - redirect to appropriate login
  if (!isAuthenticated) {
    const loginPath = requiredRole === 'admin' ? '/admin/login' : '/client/login';
    return <Navigate to={redirectTo || loginPath} state={{ from: location }} replace />;
  }

  // Authenticated but wrong role
  if (user && user.role !== requiredRole) {
    const correctPath = user.role === 'admin' ? '/admin' : '/client';
    return <Navigate to={correctPath} replace />;
  }

  return <>{children}</>;
};
