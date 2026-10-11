import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Login from './components/Authantications/Login';
import ForgotPassword from './components/Authantications/ForgotPassword';
import ResetPassword from './components/Authantications/ResetPassword';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Category from './pages/Category';
import ProductPage from './pages/Product';
import VerifyCode from './components/Authantications/VerfyEmail';
import SignUp from './components/Authantications/SignUp';
import SellerRegistration from './components/Authantications/SellerRegistration';
import ResendEmail from './components/Authantications/ResendEmail';
import SellerDashboard from './pages/SellerDashboard';
import { ProtectedSellerRoute } from './components/Authantications/ProtectedSellerRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const location = useLocation();

  const isSellerDashboard = location.pathname
    .toLowerCase()
    .startsWith('/seller-dashboard');

  return (
    <>
      {!isSellerDashboard && <Navbar />}

      <div className={isSellerDashboard ? '' : 'pt-20 overflow-auto'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shopnow" element={<Shop />} />
          <Route path="/category" element={<Category />} />
          <Route path="/product/:id" element={<ProductPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify" element={<VerifyCode />} />
          <Route path="/resend-email" element={<ResendEmail />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/seller-registration"
            element={<SellerRegistration />}
          />

          <Route
            path="/seller-dashboard/*"
            element={
            <ProtectedSellerRoute>
            <SellerDashboard />
            </ProtectedSellerRoute>
            }
          />
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;