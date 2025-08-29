import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthLayout from '../components/AuthLayout';
import sampleImage from '../assets/images/signup-image.png';
import logo from '../assets/images/logo.png';
import { apiService } from '../services/api';

const OtpVerification: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;
  const isSignUp = location.state?.isSignUp;
  
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.verifyOtp({
        email: userData.email,
        otp: otp
      });

      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setCountdown(59);
    setCanResend(false);
    setError('');

    try {
      if (isSignUp) {
        await apiService.sendOtp({
          name: userData.name,
          dob: userData.dateOfBirth,
          email: userData.email
        });
      } else {
        // For sign in, we need to implement a resend OTP endpoint
        // For now, we'll use the same signup endpoint
        await apiService.sendOtp({
          name: userData.name || '',
          dob: userData.dateOfBirth || '',
          email: userData.email
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(errorMessage);
    }
  };

  // Redirect if no user data
  if (!userData) {
    navigate('/signup');
    return null;
  }

  return (
    <AuthLayout imageSrc={sampleImage}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex items-center mb-6">
          <img src={logo} alt="HD Logo" className="h-8 w-auto mr-2" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
        <p className="text-gray-600 mb-2">Enter the OTP sent to</p>
        <p className="text-gray-800 font-medium mb-6">{userData.email}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="flex flex-col space-y-4">
          <Input 
            label="OTP Code" 
            type="text" 
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />

          <Button 
            type="submit" 
            onClick={handleVerifyOtp}
            className="mt-6"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-500">
                Resend in {countdown}s
              </span>
            )}
          </p>
          
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default OtpVerification;
