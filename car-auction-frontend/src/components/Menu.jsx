import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore.jsx';
import axios from '../api/axios.js';

const Menu = ({ onClose }) => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.post('/user/logout', {});
      console.log(response.data.message);
      clearAuth();
      navigate('/logout', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="absolute top-21 left-0 w-full h-10/11  bg-black/10 backdrop-blur-3xl flex flex-col gap-4 p-5 text-lg z-50 justify-start">
      <NavLink to="/" onClick={onClose}>
        Browse Auctions
      </NavLink>
      <NavLink to="/profile" onClick={onClose}>
        Profile
      </NavLink>
      <NavLink to="/theme" onClick={onClose}>
        Theme
      </NavLink>

      {!user ? (
        <>
          <NavLink to="/login" onClick={onClose}>
            Log In
          </NavLink>
          <NavLink to="/register" onClick={onClose}>
            Register
          </NavLink>
        </>
      ) : (
        <div>
          <button
            onClick={async () => {
              await logout();
              onClose();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
