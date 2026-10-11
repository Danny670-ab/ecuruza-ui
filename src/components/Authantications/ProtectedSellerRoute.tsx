import { Navigate } from 'react-router-dom';
import type { FC, ReactNode } from 'react';

interface ProtectedSellerRouteProps {
  children: ReactNode;
}

interface User {
  role: string;
}

export const ProtectedSellerRoute: FC<ProtectedSellerRouteProps> = ({
  children,
}) => {
  let user: User | null = null;

  try {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      user = JSON.parse(storedUser) as User;
    }
  } catch (error) {
    console.error('Failed to read user data:', error);
    localStorage.removeItem('user');
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role?.toLowerCase() !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedSellerRoute;