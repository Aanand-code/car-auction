import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

const ProtectedRoutes = () => {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  // console.log(user);

  return user && accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default ProtectedRoutes;
