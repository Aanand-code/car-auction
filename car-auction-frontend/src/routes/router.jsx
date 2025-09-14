import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Layout from '../layout/Layout.jsx';
import BrowseAuctions from '../pages/BrowseAuctions.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Missing from '../pages/Missing.jsx';
import ProtectedRoutes from '../components/ProtectedRoutes.jsx';
import VerifyOTP from '../pages/VerifyOTP.jsx';
import Logout from '../pages/Logout.jsx';
import Profile from '../pages/Profile.jsx';
import Theme from '../pages/Theme.jsx';
import AuctionInfo from '../pages/AuctionInfo.jsx';
import PostAuction from '../pages/PostAuction.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verify-otp" element={<VerifyOTP />} />
      <Route path="logout" element={<Logout />} />
      <Route path="theme" element={<Theme />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route index element={<BrowseAuctions />} />
        <Route path="profile" element={<Profile />} />
        <Route path="auction-info" element={<AuctionInfo />} />
        <Route path="post-auction" element={<PostAuction />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Missing />} />
    </Route>
  )
);

export default router;
