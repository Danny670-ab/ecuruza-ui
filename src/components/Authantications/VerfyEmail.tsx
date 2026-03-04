import React, { useEffect, useRef, useState } from 'react';
import { sendVerificationCode, verifyEmail as apiVerifyEmail } from '../../redux/services/verifyEmail';
import { useNavigate } from 'react-router-dom';

const CODE_LENGTH = 6;

const VerifyEmail: React.FC = () => {
  const [step, setStep] = useState<'enterCode'>('enterCode');
  const [codeValues, setCodeValues] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [email, setEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  // no reset-password flow; verification-only
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
    try {
      await sendVerificationCode(email);
      // show code entry (already the only step)
      setStep('enterCode');
    } catch (err) {
      console.error('send code error', err);
      // TODO: show error to user
    }
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
    try {
  await apiVerifyEmail({ email, code });
  // success -> redirect to login (or show success)
      navigate('/login');
    } catch (err) {
      console.error('verify error', err);
      // TODO: show user-friendly error
    } finally {
      setVerifying(false);
    }
  };
  // no submitNewPassword - verification-only flow

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm bg-[#F2EEEE]  rounded-2xl shadow-lg p-6">
        {step === 'enterCode' && (
          <>
            <h2 className="text-center text-2xl font-semibold text-[#0C6227] mb-2">Verify Email</h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Enter the 6-digit code sent to your Email
            </p>

            {/* Optionally allow resending / entering email */}
            <form onSubmit={sendCode} className="mb-4">
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-white px-3 py-2 rounded-md border border-gray-200 focus:outline-none"
                />
              
              </div>
            </form>

            <form onSubmit={verifyCode} className="flex flex-col  items-center gap-6">
              <div
                className="flex gap-3 "
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
              Didn't get a code? <button type="button" className="text-emerald-700 underline" onClick={() => navigate('/resend-email')}>Resend</button>
            </p>
          </>
        )}

        {/* no reset-password UI in verification-only flow */}
      </div>
    </div>
  );
};

export default VerifyEmail;