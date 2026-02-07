import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CODE_LENGTH = 6;

const VerifyCode: React.FC = () => {
  const [step, setStep] = useState<'enterCode' | 'resetPassword'>('enterCode');
  const [codeValues, setCodeValues] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // reset password state
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // focus first input when step is enterCode
    if (step === 'enterCode') {
      setTimeout(() => inputsRef.current[0]?.focus(), 80);
    }
  }, [step]);

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    // mock API delay
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setStep('enterCode');
    // In real app: show toast "code sent"
  };

  const onCodeChange = (idx: number, v: string) => {
    if (!v) {
      setCodeValues((prev) => {
        const next = [...prev];
        next[idx] = '';
        return next;
      });
      return;
    }
    // accept only digits, single character
    const ch = v.replace(/\D/g, '').slice(-1);
    if (!ch) return;
    setCodeValues((prev) => {
      const next = [...prev];
      next[idx] = ch;
      return next;
    });
    // focus next
    const nextEl = inputsRef.current[idx + 1];
    if (nextEl) nextEl.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !codeValues[idx]) {
      const prev = inputsRef.current[idx - 1];
      if (prev) {
        prev.focus();
        setCodeValues((s) => {
          const next = [...s];
          next[idx - 1] = '';
          return next;
        });
      }
    } else if (e.key === 'ArrowLeft') {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight') {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!paste) return;
    const arr = paste.split('');
    const next = Array(CODE_LENGTH).fill('');
    for (let i = 0; i < arr.length; i++) next[i] = arr[i];
    setCodeValues(next);
    // focus after last pasted
    const last = Math.min(arr.length, CODE_LENGTH) - 1;
    setTimeout(() => inputsRef.current[last + 1]?.focus(), 50);
  };

  const verifyCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = codeValues.join('');
    if (code.length !== CODE_LENGTH) return;
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 800));
    setVerifying(false);
    // mock success -> go to reset password form
    navigate('/login');
  };

  const submitNewPassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password || password !== confirm) return;
    // mock submit
    await new Promise((r) => setTimeout(r, 700));
    // redirect to login or show success
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        {step === 'enterCode' && (
          <>
            <h2 className="text-center text-2xl font-semibold text-[#0C6227] mb-2">Verify Code</h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Enter the 6-digit code sent to your Email
            </p>

            {/* Optionally allow resending / entering email */}
            <form onSubmit={sendCode} className="mb-4">
              <label className="text-xs text-gray-500">Email (to resend code)</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 rounded-md bg-[#3F4E40] text-white"
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>

            <form onSubmit={verifyCode} className="flex flex-col items-center gap-6">
              <div
                className="flex gap-3"
                onPaste={onPaste}
                aria-label="Verification code input"
              >
            {Array.from({ length: CODE_LENGTH }).map((_, i) => (
         <input
         key={i}
         ref={(el) => {
         inputsRef.current[i] = el;
         }}
         value={codeValues[i]}
         onChange={(e) => onCodeChange(i, e.target.value)}
         onKeyDown={(e) => onKeyDown(e, i)}
         maxLength={1}
         inputMode="numeric"
        className="w-12 h-12 text-center text-lg rounded-md border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-emerald-200"
        aria-label={`Digit ${i + 1}`}
        />
           ))}
              </div>

              <button
                type="submit"
                className="w-40 py-2 bg-[#3F4E40] text-white rounded-full shadow"
                disabled={verifying}
              >
                {verifying ? 'Verifying...' : 'Verify'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Didn't get a code? <button className="text-emerald-700 underline" onClick={() => setEmail('')}>Resend</button>
            </p>
          </>
        )}

        {step === 'resetPassword' && (
          <>
            <h2 className="text-center text-2xl font-semibold text-[#0C6227] mb-2">Reset Password</h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Enter your new password
            </p>

            <form onSubmit={submitNewPassword} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">New password</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Confirm password</label>
                <div className="relative mt-2">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#3F4E40] text-white rounded-full shadow"
              >
                Save password
              </button>

              <div className="text-center text-sm">
                <Link to="/login" className="text-emerald-700">Back to Login</Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyCode;