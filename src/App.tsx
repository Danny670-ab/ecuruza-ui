import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/Authantications/Login';
import ForgotPassword from './components/Authantications/ForgotPassword';
import ResetPassword from './components/Authantications/ResetPassword';
import Home from './pages/Home';
import VerifyCode from './components/Authantications/VerfyCode';
import SignUp from './components/Authantications/SignUp';
import SellerRegistration from './components/Authantications/SellerRegistration';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify" element={<VerifyCode />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/seller-registration" element={<SellerRegistration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;