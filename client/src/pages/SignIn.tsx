import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthLayout from '../components/AuthLayout';
import GoogleAuth from '../components/GoogleAuth';
import sampleImage from '../assets/images/signup-image.png';
import logo from '../assets/images/logo.png';
import { apiService } from '../services/api';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: import.meta.env.VITE_SAMPLE_USER_EMAIL || '',
    otp: ''
  });
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.verifyOtp({
        email: formData.email,
        otp: formData.otp
      });

      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Navigate to dashboard
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setCountdown(59);
    setCanResend(false);

    try {
      // For sign in, we need to implement a resend OTP endpoint
      // For now, we'll use the same signup endpoint
      await apiService.sendOtp({
        name: '',
        dob: '',
        email: formData.email
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(errorMessage);
      setCanResend(true);
      setCountdown(0);
    }
  };

  return (
    <AuthLayout imageSrc={sampleImage}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex items-center mb-6">
          <img src={logo} alt="HD Logo" className="h-8 w-auto mr-2" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
        <p className="text-gray-600 mb-6">Please login to continue to your account.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Email OTP Form */}
        <form className="flex flex-col space-y-4 mb-6">
          <Input 
            label="Email" 
            type="email" 
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          
          <Input 
            label="OTP" 
            type="text" 
            placeholder="OTP"
            value={formData.otp}
            onChange={(e) => handleInputChange('otp', e.target.value)}
            required
          />

          <div className="flex items-center justify-between">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-500 text-sm">
                Resend in {countdown}s
              </span>
            )}
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Keep me logged in</span>
            </label>
          </div>

          <Button 
            type="submit" 
            onClick={handleSignIn}
            className="mt-6"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth */}
        <div className="mb-6">
          <GoogleAuth />
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Need an account? </span>
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Create one
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
