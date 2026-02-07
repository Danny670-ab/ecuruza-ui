import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom'

const ForgotPassword: React.FC = () => {
  const [identifier, setIdentifier] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call API to request password reset
    console.log('request password reset for', identifier)
    navigate('/reset-password', { state: { identifier } })
  }

  return (
    <div className="flex h-full  bg-gray-5 items-center justify-center px-4">
      <div className="mt-10 w-[400px] mt-30 max-w-md bg-[#F2EEEE] border border-gray-200 rounded-[25px]  shadow-xl p-6">
        <h1 className="text-2xl mt-10 font-semibold text-[#0C6227] text-center">Forgot Password</h1>
        <p className="text-sm text-black text-center mt-2">
          Enter your Email or Phone number
          <br />
          Reset your password
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <div className="relative items-center justify-center flex">
              <span className="absolute inset-y-0 left-14 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7M3 8.5l9 6 9-6" />
                </svg>
              </span>

              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or Phone number"
                className="w-[316px] pl-11 pr-3 py-2 rounded-md bg-white border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                aria-label="Email or Phone number"
              />
            </div>
          </label>
          <div className='flex items-center justify-center'>
            <button
            type="submit"
            className="mt-2 w-[316px] mb-10 bg-[#3F4E40] text-white py-3 rounded-md text-lg font-medium shadow flex items-center justify-center gap-2"
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

export default ForgotPassword