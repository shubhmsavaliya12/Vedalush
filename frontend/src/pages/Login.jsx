import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import LegalModal from '../components/ui/LegalModal';
import { Helmet } from 'react-helmet-async';

const COUNTRIES_LIST = [
  { name: 'India', currency: 'INR' },
  { name: 'United States', currency: 'USD' },
  { name: 'United Kingdom', currency: 'GBP' },
  { name: 'European Union', currency: 'EUR' },
  { name: 'Australia', currency: 'AUD' },
  { name: 'Canada', currency: 'CAD' },
];

const Login = () => {
  const [step, setStep] = useState('auth'); // 'auth', 'signup_otp', 'forgot_email', 'forgot_otp', 'forgot_reset'
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [country, setCountry] = useState('India');
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: 'terms' });
  
  const { setUser } = useAuth();
  const { currency, changeCurrency } = useCurrency();
  const navigate = useNavigate();

  const openLegal = (type, e) => {
    e.preventDefault();
    setLegalModal({ isOpen: true, type });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || '';
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup-otp';
    const bodyData = isLogin ? { email, password } : { name, email, password, country, preferredCurrency: currency };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          setUser(data.user);
          if (data.user.preferredCurrency) changeCurrency(data.user.preferredCurrency);
          navigate('/');
        } else {
          setSuccessMsg('Verification code sent! Please check your email inbox.');
          setStep('signup_otp');
        }
      } else {
        setError(data.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || '';
    try {
      const response = await fetch(`${API_URL}/api/auth/signup-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        if (data.user.preferredCurrency) changeCurrency(data.user.preferredCurrency);
        navigate('/');
      } else {
        setError(data.message || 'Verification failed.');
      }
    } catch (err) {
      console.error('Signup verify error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendSignupOtp = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || '';
    try {
      const response = await fetch(`${API_URL}/api/auth/signup-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, country, preferredCurrency: currency })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('A new verification code has been sent to your email.');
      } else {
        setError(data.message || 'Failed to resend code.');
      }
    } catch (err) {
      setError('Network error while resending code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || '';
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('Password reset code sent! Please check your email inbox.');
        setStep('forgot_otp');
      } else {
        setError(data.message || 'Failed to send reset code.');
      }
    } catch (err) {
      console.error('Forgot email error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotOtpVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || '';
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password-verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('Code verified. Please enter your new password.');
        setStep('forgot_reset');
      } else {
        setError(data.message || 'Invalid verification code.');
      }
    } catch (err) {
      console.error('Forgot OTP error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || '';
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('Password reset successfully! You can now log in.');
        setOtp('');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsLogin(true);
        setStep('auth');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{step === 'auth' ? (isLogin ? 'Login' : 'Sign Up') : 'Verification'} | Vedalush</title>
      </Helmet>
      
      <div className="min-h-screen bg-nature-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-nature-900 skew-y-3 transform origin-top-left -z-10"></div>
        
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <img 
              src="/vedalus.png" 
              alt="Vedalush Logo" 
              className="h-12 sm:h-16 w-auto mx-auto object-contain mb-4" 
            />
            <p className="text-nature-600 font-light">
              {step === 'auth' && (isLogin ? 'Welcome back to pure nature.' : 'Join the journey to radiant skin.')}
              {step === 'signup_otp' && 'Verify your email address to get started.'}
              {step === 'forgot_email' && 'Reset your Vedalush password.'}
              {step === 'forgot_otp' && 'Enter the 6-digit code sent to your email.'}
              {step === 'forgot_reset' && 'Create a secure new password.'}
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm text-center font-medium">
              {successMsg}
            </div>
          )}

          {/* STEP 1: LOGIN OR SIGNUP FORM */}
          {step === 'auth' && (
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                    required={!isLogin}
                    placeholder="Jane Doe"
                  />
                </div>
              )}
              
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      const sel = COUNTRIES_LIST.find(c => c.name === e.target.value);
                      if (sel) changeCurrency(sel.currency);
                    }}
                    className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow cursor-pointer"
                  >
                    {COUNTRIES_LIST.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.currency})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-nature-800 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                  required
                  placeholder="jane@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nature-800 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                  required
                  placeholder="••••••••"
                />
              </div>

              {isLogin && (
                <div className="flex justify-end -mt-2">
                  <button
                    type="button"
                    onClick={() => { setStep('forgot_email'); setError(''); setSuccessMsg(''); }}
                    className="text-xs text-nature-600 hover:text-nature-900 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {!isLogin && (
                <div className="flex items-start space-x-2 pt-2 pb-2">
                  <input 
                    type="checkbox" 
                    id="agree" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 text-nature-900 border-nature-300 rounded focus:ring-nature-500"
                  />
                  <label htmlFor="agree" className="text-sm text-nature-600">
                    I agree to the <button type="button" onClick={(e) => openLegal('terms', e)} className="text-nature-900 font-medium hover:underline">Terms of Service</button> and <button type="button" onClick={(e) => openLegal('privacy', e)} className="text-nature-900 font-medium hover:underline">Privacy Policy</button>
                  </label>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading || (!isLogin && !agreed)}
                className="w-full bg-nature-900 hover:bg-nature-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors shadow-soft"
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          )}

          {/* STEP 2: SIGNUP OTP VERIFICATION */}
          {step === 'signup_otp' && (
            <form onSubmit={handleSignupVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-nature-800 mb-2 text-center">
                  Enter the 6-digit code sent to <strong className="text-nature-900">{email}</strong>
                </label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow font-mono text-2xl text-center tracking-widest"
                  required
                  placeholder="123456"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-nature-900 hover:bg-nature-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors shadow-soft"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <div className="flex justify-between items-center text-sm pt-2 text-nature-600">
                <button
                  type="button"
                  onClick={() => { setStep('auth'); setOtp(''); setError(''); setSuccessMsg(''); }}
                  className="hover:text-nature-900 font-medium"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={handleResendSignupOtp}
                  disabled={loading}
                  className="text-nature-900 font-medium hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: FORGOT PASSWORD - ENTER EMAIL */}
          {step === 'forgot_email' && (
            <form onSubmit={handleForgotEmailSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-nature-800 mb-1">Enter your registered email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                  required
                  placeholder="jane@example.com"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || !email}
                className="w-full bg-nature-900 hover:bg-nature-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors shadow-soft"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setStep('auth'); setError(''); setSuccessMsg(''); }}
                  className="text-sm text-nature-600 hover:text-nature-900 font-medium"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: FORGOT PASSWORD - VERIFY OTP */}
          {step === 'forgot_otp' && (
            <form onSubmit={handleForgotOtpVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-nature-800 mb-2 text-center">
                  Enter 6-digit code sent to <strong className="text-nature-900">{email}</strong>
                </label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow font-mono text-2xl text-center tracking-widest"
                  required
                  placeholder="123456"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-nature-900 hover:bg-nature-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors shadow-soft"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <div className="flex justify-between items-center text-sm pt-2 text-nature-600">
                <button
                  type="button"
                  onClick={() => { setStep('forgot_email'); setOtp(''); setError(''); setSuccessMsg(''); }}
                  className="hover:text-nature-900 font-medium"
                >
                  &larr; Change Email
                </button>
                <button
                  type="button"
                  onClick={handleForgotEmailSubmit}
                  disabled={loading}
                  className="text-nature-900 font-medium hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: FORGOT PASSWORD - RESET PASSWORD */}
          {step === 'forgot_reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-nature-800 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nature-800 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-shadow"
                  required
                  minLength={6}
                  placeholder="Repeat new password"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-nature-900 hover:bg-nature-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors shadow-soft"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          {step === 'auth' && (
            <div className="mt-8 text-center text-sm text-nature-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                className="text-nature-900 font-medium hover:underline"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </div>
          )}

        </div>
      </div>

      <LegalModal 
        isOpen={legalModal.isOpen} 
        type={legalModal.type} 
        onClose={() => setLegalModal({ isOpen: false, type: 'terms' })} 
      />
    </>
  );
};

export default Login;
