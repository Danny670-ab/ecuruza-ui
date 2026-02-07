import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    // lock body scroll while Login is mounted
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password, remember })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full h-[500px] max-w-md bg-[#F2EEEE] border border-gray-200 rounded-2xl shadow-xl p-5">
        <h1 className="text-2xl mt-10 font-bold text-[#0C6227] text-center">Welcome Back!</h1>
        <p className="text-sm text-black text-center mt-2">Please login to your account</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          <label className="block relative items-center justify-center flex">
            <span className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7M3 8.5l9 6 9-6" />
              </svg>
            </span>

            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or Phone number"
              className="w-[316px] pl-10 pr-3 py-2 rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
              aria-label="Email or Phone number"
            />
          </label>

          <label className="block relative items-center justify-center flex">
            <span className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2M6 10V8a6 6 0 0 1 12 0v2" />
                <rect x="4" y="10" width="16" height="10" rx="2" ry="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-[316px] pl-10 pr-10 py-2 rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
              aria-label="Password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.58 10.58A3 3 0 0 1 13.42 13.42" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.05 12.55C3.9 7.05 8.7 4 12 4c3.3 0 8.1 3.05 9.95 8.55A11.98 11.98 0 0 1 12 20c-3.3 0-8.1-3.05-9.95-7.45z" />
                  <circle cx="12" cy="12" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </label>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => setRemember((r) => !r)}
              className="inline-flex items-center gap-2 text-gray-700"
            >
              <span className={`w-5 h-5 rounded-sm ml-11 flex items-center justify-center ${remember ? 'bg-emerald-700' : 'bg-white border border-gray-300'}`}>
                {remember ? (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </span>
              <span>Remember me</span>
            </button>

            <Link to="/forgot" className="text-emerald-700 mr-14 hover:underline">Forgot password?</Link>
          </div>

          <div className='items-center justify-center flex'>
            <button
              type="submit"
              className="mt-2 w-[316px] bg-[#3F4E40] text-white py-2 rounded-md text-base font-medium shadow"
            >
              Login
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Or sign up with</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          <div className='flex items-center justify-center'>
            <button
              type="button"
              className="w-[316px] bg-white text-black py-2 rounded-md text-sm font-medium shadow flex items-center justify-center gap-3"
              onClick={() => console.log('Google login')}
            >
              <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.7-37.1-5.3-54.9H272v104h146.9c-6.3 34.1-25.1 62.9-53.8 82.2v68.3h87c51.2-47.1 81.4-116.7 81.4-199.5z"/>
                <path fill="#34A853" d="M272 544.3c72.6 0 133.6-24.2 178.1-65.9l-86.9-68.3c-24.1 16.2-55 25.7-91.2 25.7-70 0-129.3-47.2-150.6-110.6h-89.6v69.6C84.8 478.9 170 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M121.4 327.2c-10.6-31.8-10.6-66.1 0-97.9V159.7h-89.6C9.6 211.6 0 239.3 0 272c0 32.7 9.6 60.4 31.8 112.3l89.6-57.1z"/>
                <path fill="#EA4335" d="M272 109.7c38.7-.6 75 13.4 102.9 38.7l77.1-77.1C405.4 25.8 344.4 0 272 0 170 0 84.8 65.4 31.8 159.7l89.6 69.6C142.7 157 202 109.7 272 109.7z"/>
              </svg>
              <span>Login With Google</span>
            </button>
          </div>
        </form>

        <hr className="my-4 border-gray-200" />

        <p className="text-center text-sm text-black">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-700 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login