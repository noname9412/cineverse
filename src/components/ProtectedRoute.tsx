import { Navigate } from 'react-router-dom';
import { useSettingsStore } from '@/store/settings';
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const accessToken = useSettingsStore((state) => state.accessToken);
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};