import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type { JSX } from 'react';

export default function ProtectedRoute({children}:{children:JSX.Element}){
  return useAppSelector(s=>s.auth.token) ? children : <Navigate to="/login" replace />;
}
