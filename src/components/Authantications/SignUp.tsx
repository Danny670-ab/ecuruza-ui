import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // derived flag used to enable/disable submit button
  const isFormFilled = useMemo(() => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      /^\S+@\S+\.\S+$/.test(email) &&
      phone.trim() !== '' &&
      password.length >= 6 &&
      confirm.length > 0 &&
      password === confirm
    );
  }, [firstName, lastName, email, phone, password, confirm]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
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
    // TODO: replace with real sign up API call
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    console.log({ firstName, lastName, email, phone });
    navigate('/verify');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f3f3] px-4 py-8">
      <div className="w-[488px] max-w-md rounded-2xl bg-[#F2EEEE] shadow-md p-5">
        <h1 className="text-xl text-center text-[#0C6227] font-bold mb-1">Sign Up</h1>
        <p className="text-sm text-center text-black mb-4">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="flex items-center justify-center">
            <input
              aria-label="First name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-[316px] bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200 focus:outline-none text-sm"
            />
          </div>
          {errors.firstName && <p className="mt-1 text-xs text-red-600 text-center">{errors.firstName}</p>}

          <div className="flex items-center justify-center">
            <input
              aria-label="Last name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-[316px] px-3 py-2 bg-white rounded-md shadow-sm border border-gray-200 focus:outline-none text-sm"
            />
          </div>
          {errors.lastName && <p className="mt-1 text-xs text-red-600 text-center">{errors.lastName}</p>}

          <div className="flex items-center justify-center">
            <input
              aria-label="Email address"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[316px] px-3 py-2 bg-white rounded-md shadow-sm border border-gray-200 focus:outline-none text-sm"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600 text-center">{errors.email}</p>}

          <div className="flex items-center justify-center">
            <input
              aria-label="Phone number"
              placeholder="Phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-[316px] px-3 py-2 bg-white rounded-md shadow-sm border border-gray-200 focus:outline-none text-sm"
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-600 text-center">{errors.phone}</p>}

          <div className="relative flex items-center justify-center">
            <input
              aria-label="Password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[316px] px-3 py-2 bg-white rounded-md shadow-sm border border-gray-200 focus:outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-16 top-1/2 -translate-y-1/2 text-xs text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600 text-center">{errors.password}</p>}

          <div className="relative flex items-center justify-center">
            <input
              aria-label="Confirm password"
              placeholder="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-[316px] px-3 py-2 bg-white rounded-md shadow-sm border border-gray-200 focus:outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-16 top-1/2 -translate-y-1/2 text-xs text-gray-600"
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirm && <p className="mt-1 text-xs text-red-600 text-center">{errors.confirm}</p>}

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`w-[316px] py-2 rounded-full text-sm font-medium ${isFormFilled && !loading ? 'bg-[#3F4E40] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              disabled={!isFormFilled || loading}
            >
              {loading ? 'Signing...' : 'Sign Up'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Or sign up with</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              className="w-[316px] py-2 bg-white border border-gray-200 rounded-full flex items-center justify-center gap-3 text-sm"
              onClick={() => console.log('Google signup')}
            >
              <svg className="w-4 h-4" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.7-37.1-5.3-54.9H272v104h146.9c-6.3 34.1-25.1 62.9-53.8 82.2v68.3h87c51.2-47.1 81.4-116.7 81.4-199.5z"/>
                <path fill="#34A853" d="M272 544.3c72.6 0 133.6-24.2 178.1-65.9l-86.9-68.3c-24.1 16.2-55 25.7-91.2 25.7-70 0-129.3-47.2-150.6-110.6h-89.6v69.6C84.8 478.9 170 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M121.4 327.2c-10.6-31.8-10.6-66.1 0-97.9V159.7h-89.6C9.6 211.6 0 239.3 0 272c0 32.7 9.6 60.4 31.8 112.3l89.6-57.1z"/>
                <path fill="#EA4335" d="M272 109.7c38.7-.6 75 13.4 102.9 38.7l77.1-77.1C405.4 25.8 344.4 0 272 0 170 0 84.8 65.4 31.8 159.7l89.6 69.6C142.7 157 202 109.7 272 109.7z"/>
              </svg>
              <span className="text-sm">Sign up with Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account? <Link to="/login" className="text-emerald-700 font-medium">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;