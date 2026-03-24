import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/Authantications/Login';
import ForgotPassword from './components/Authantications/ForgotPassword';
import ResetPassword from './components/Authantications/ResetPassword';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductPage from './pages/Product';
import VerifyCode from './components/Authantications/VerfyEmail';
import SignUp from './components/Authantications/SignUp';
import SellerRegistration from './components/Authantications/SellerRegistration';
import ResendEmail from './components/Authantications/ResendEmail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify" element={<VerifyCode />} />
          <Route path="/resend-email" element={<ResendEmail />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/seller-registration" element={<SellerRegistration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;