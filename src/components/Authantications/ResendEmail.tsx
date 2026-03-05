import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { resendVerificationEmail } from '../../redux/services/resendEmail';

interface ErrorResponse {
  message?: string;
}

const ResendEmail: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setMessage(null);

    try {
      const response = await resendVerificationEmail(email);
      
      // Check if email is already verified based on response
      if (response && response.message && response.message.toLowerCase().includes('already verified')) {
        // Email is already verified - go to login
        setMessage({ type: 'info', text: 'This email is already verified. Redirecting to login...' });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // Email not verified - go to verify page to enter code
        setMessage({ type: 'success', text: 'Verification code sent! Please check your email.' });
        setTimeout(() => {
          navigate('/verify', { state: { email } });
        }, 1500);
      }
    } catch (err) {
      console.error('send code error', err);
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMsg = axiosError?.response?.data?.message || '';
      
      // Check if error indicates email is already verified
      if (errorMsg.toLowerCase().includes('already verified')) {
        setMessage({ type: 'info', text: 'This email is already verified. Redirecting to login...' });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Failed to send verification code. Please try again.' });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-center text-2xl font-semibold text-[#0C6227] mb-2">Resend Verification Code</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your email address to receive a new verification code
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : message.type === 'info'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-[#3F4E40] text-white rounded-full shadow hover:bg-[#2d3a2e] transition-colors disabled:opacity-50"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/verify"
            className="text-sm text-[#3F4E40] hover:underline flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Verify
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-[#3F4E40]"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResendEmail;
