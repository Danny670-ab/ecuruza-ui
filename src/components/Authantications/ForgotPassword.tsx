import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const ForgotPassword: React.FC = () => {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier.trim()) {
      toast.error('Please enter your email or phone number')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/auth/forgot-password`,
        {
          identifier: identifier.trim(),
        }
      )

      console.log('Forgot password response:', response.data)

      toast.success(
        'Your account was found! The reset link was sent to your email.'
      )
    } catch (error) {
      console.error('Forgot password error:', error)

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            'Unable to process your request. Please try again.'
        )
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full bg-gray-5 items-center justify-center px-4">
      <div className="w-100 mt-30 max-w-md bg-[#F2EEEE] border border-gray-200 rounded-[25px] shadow-xl p-6">

        <h1 className="text-2xl mt-10 font-semibold text-[#0C6227] text-center">
          Forgot Password
        </h1>

        <p className="text-sm text-black text-center mt-2">
          Enter your Email or Phone number
          <br />
          Reset your password
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <label className="block">
            <div className="relative items-center justify-center flex">

              {/* Email Icon */}
              <span className="absolute inset-y-0 left-14 flex items-center text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7M3 8.5l9 6 9-6"
                  />
                </svg>
              </span>

              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or Phone number"
                className="w-79 pl-17 pr-3 py-2 rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                aria-label="Email or Phone number"
                disabled={loading}
              />

            </div>
          </label>

          {/* Submit Button */}
          <div className="flex items-center justify-center">

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-79 mb-10 bg-[#3F4E40] text-white py-3 rounded-md text-lg font-medium shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Forgot Password'}

              {!loading && (
                <span className="p-1 rounded-full bg-white/10">

                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11v6M8 7h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                    />
                  </svg>

                </span>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default ForgotPassword;