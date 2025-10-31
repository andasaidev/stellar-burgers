// src/components/protected-route/protected-route.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import {
  isAuthCheckedSelector,
  userSelector
} from '../../services/slices/user-slice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true
}) => {
  const location = useLocation();
  const user = useAppSelector(userSelector);
  const isAuthChecked = useAppSelector(isAuthCheckedSelector);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (requireAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // перенаправляем на главную или профиль
    return <Navigate to='/' replace />;
  }

  return children;
};
