import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SellerRegistration = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const isFormFilled = useMemo(() => {
    return (
      firstName.trim() !== '' &&
      businessName.trim() !== '' &&
      /^\S+@\S+\.\S+$/.test(email) &&
      phone.trim() !== '' &&
      password.length >= 6 &&
      confirm.length > 0 &&
      password === confirm
    );
  }, [firstName, businessName, email, phone, password, confirm]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'Full name is required';
    if (!businessName.trim()) e.businessName = 'Business name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Invalid email';
    if (!phone.trim()) e.phone = 'Phone number is required';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    if (!confirm) e.confirm = 'Please confirm password';
    else if (password !== confirm) e.confirm = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    console.log({ firstName, businessName, email, phone });
    navigate('/verify');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f3f3] px-4 py-8">
      <div className="w-[488px] max-w-md rounded-2xl bg-[#F2EEEE] shadow-md p-5">
        <h1 className="text-xl text-center mt-4 mb-6 text-[#0C6227] font-bold">Seller Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>

          <input
            placeholder="Full Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
          {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}

          <input
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
          {errors.businessName && <p className="text-xs text-red-600">{errors.businessName}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}

          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 rounded-md border"
          />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-xs">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}

          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 rounded-md border"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2 text-xs">
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirm && <p className="text-xs text-red-600">{errors.confirm}</p>}

          <button
            type="submit"
            disabled={!isFormFilled || loading}
            className={`w-full py-2 rounded-full ${isFormFilled ? 'bg-green-700 text-white' : 'bg-gray-300'}`}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p className="text-center text-sm">
            Already have an account? <Link to="/login" className="text-green-700">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;