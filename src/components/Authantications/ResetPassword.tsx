import React, { useState } from 'react'
import {useLocation, useNavigate } from 'react-router-dom'

type LocationState = { identifier?: string }

const ResetPassword: React.FC = () => {
  const location = useLocation()
  const { identifier } = (location.state as LocationState) || {}
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [remember] = useState(true) // <-- added

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!password || !confirm) {
      setError('Please fill both fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    // TODO: call API to actually reset using token/identifier
    console.log('reset password for', identifier, password, { remember })

    // on success navigate to login
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen h-full   bg-gray-50 items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#F2EEEE] border border-gray-200 rounded-[25px]  shadow-xl p-6">
        <h1 className="text-2xl mt-5 font-semibold text-[#0C6227] text-center">Reset password</h1>
        <p className="text-sm text-black text-center mt-2">Please enter your new password</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative items-center justify-center flex">
            <span className="absolute inset-y-0 left-5 flex items-center text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 11v6M8 7h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-[316px] pl-11 pr-12 py-2 rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600"
              aria-label="toggle password"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className='flex items-center justify-center'>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="w-[316px] pl-4 pr-4 py-2 rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {error ? <div className="text-sm ml-4 text-red-600">{error}</div> : null}

          <div className="flex items-center justify-between text-sm">
        
          </div>
           <div className='flex items-center justify-center'>
            <button
            type="submit"
            className=" mb-5 w-[316px] bg-[#3F4E40] text-white py-2 rounded-md text-lg font-medium shadow flex items-center justify-center gap-2"
          >
            forgot password
            <span className="p-1 rounded-full bg-white/10">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 11v6M8 7h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
            </span>
          </button>
           </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword