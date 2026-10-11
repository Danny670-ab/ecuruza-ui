import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const SellerRegistration = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isFormFilled = useMemo(() => {
    return (
      fullName.trim() !== '' &&
      businessName.trim() !== '' &&
      /^\S+@\S+\.\S+$/.test(email) &&
      phone.trim() !== '' &&
      password.length >= 6 &&
      confirm.length > 0 &&
      password === confirm &&
      acceptTerms
    );
  }, [
    fullName,
    businessName,
    email,
    phone,
    password,
    confirm,
    acceptTerms,
  ]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!fullName.trim()) {
      e.fullName = 'Full name is required';
    }

    if (!businessName.trim()) {
      e.businessName = 'Business name is required';
    }

    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      e.email = 'Invalid email';
    }

    if (!phone.trim()) {
      e.phone = 'Phone number is required';
    }

    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Minimum 6 characters';
    }

    if (!confirm) {
      e.confirm = 'Please confirm password';
    } else if (password !== confirm) {
      e.confirm = 'Passwords do not match';
    }

    if (!acceptTerms) {
      e.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/auth/register/seller`,
        {
          fullName: fullName,
          businessName: businessName,
          email: email,
          phone: phone,
          password: password,
        }
      );

      const data = response.data;

      console.log('API Response:', data);
      console.log('Validation Details:', data.error?.details);

      toast.success(
        'Registration successful! Check your email for verification.'
      );

      console.log('Seller Registration Successful:', data);

      navigate('/verify', {
        state: { email },
      });
    } catch (error) {
      console.error('Error during registration:', error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        console.log('API Error Response:', data);
        console.log('Validation Details:', data?.error?.details);

        if (error.response?.status === 409) {
          toast.error('Email or Phone already exists');

          setErrors({
            apiError:
              'Email or Phone already exists. Please use different information.',
          });
        } else {
          toast.error(
            data?.message || 'Registration failed. Please try again.'
          );

          setErrors({
            apiError:
              data?.message || 'Registration failed. Please try again.',
          });
        }
      } else {
        toast.error(
          'Unable to connect to the server. Please try again.'
        );

        setErrors({
          api: 'Unable to connect to the server. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f3f3] px-4 py-8">
      <div className="w-122 max-w-md rounded-2xl bg-[#F2EEEE] shadow-md p-5">
        <h1 className="text-xl text-center mt-4 mb-6 text-[#0C6227] font-bold">
          Seller Registration
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 relative items-center justify-center"
          noValidate
        >
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-79 ml-10 pl-10 pr-3 py-2 justify-center items-center flex rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
          />

          {errors.fullName && (
            <p className="text-xs text-red-600">
              {errors.fullName}
            </p>
          )}

          <input
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-79 ml-10 pl-10 pr-3 py-2 justify-center items-center flex rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
          />

          {errors.businessName && (
            <p className="text-xs text-red-600">
              {errors.businessName}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-79 ml-10 pl-10 pr-3 py-2 justify-center items-center flex rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
          />

          {errors.email && (
            <p className="text-xs text-red-600">
              {errors.email}
            </p>
          )}

          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-79 ml-10 pl-10 pr-3 py-2 justify-center items-center flex rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
          />

          {errors.phone && (
            <p className="text-xs text-red-600">
              {errors.phone}
            </p>
          )}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-79 ml-10 pl-10 pr-3 py-2 justify-center items-center flex rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-16 top-2 text-xs"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-red-600">
              {errors.password}
            </p>
          )}

          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-79 ml-10 pl-10 pr-3 py-2 justify-center items-center flex rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-16 top-2 text-xs"
            >
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>

          {errors.confirm && (
            <p className="text-xs text-red-600">
              {errors.confirm}
            </p>
          )}

          <div className="flex items-center ml-23 mt-5 gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 accent-[#0C6227]"
            />

            <label
              htmlFor="terms"
              className="text-xs text-gray-600"
            >
              I agree to the{' '}
              <a
                href="#"
                className="text-green-700 underline"
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          {errors.acceptTerms && (
            <p className="text-xs text-red-600 ml-10">
              {errors.acceptTerms}
            </p>
          )}

          {errors.apiError && (
            <p className="text-xs text-red-600 ml-10">
              {errors.apiError}
            </p>
          )}

          {errors.api && (
            <p className="text-xs text-red-600 ml-10">
              {errors.api}
            </p>
          )}

          <button
            type="submit"
            disabled={!isFormFilled || loading}
            className={`w-79 mt-2 ml-10 py-2 rounded-2xl ${
              isFormFilled
                ? 'bg-[#3F4E40] text-white'
                : 'bg-[#5a695b] text-gray-200 cursor-not-allowed'
            }`}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-green-700"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistration;