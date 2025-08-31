import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthLayout from '../components/AuthLayout';
import GoogleAuth from '../components/GoogleAuth';
import Toast from '../components/Toast';
import sampleImage from '../assets/images/signup-image.png';
import logo from '../assets/images/logo.png';
import { apiService } from '../services/api';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: import.meta.env.VITE_SAMPLE_USER_NAME || '',
    dateOfBirth: import.meta.env.VITE_SAMPLE_USER_DOB || '',
    email: import.meta.env.VITE_SAMPLE_USER_EMAIL || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
    setUserExists(false); // Clear user exists message
  };

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUserExists(false);
    try {
      await apiService.sendOtp({
        name: formData.name,
        dob: formData.dateOfBirth,
        email: formData.email
      });
    
      navigate('/verify-otp', {
        state: {
          userData: formData,
          isSignUp: true
        }
      });
    
    } catch (err : any ) {
      const errorMessage =
        err?.response?.data?.message || err.message || 'Failed to send OTP';
    
      console.log('Caught error:', errorMessage);
    
      if (
        errorMessage.toLowerCase().includes('already exists') ||
        errorMessage.toLowerCase().includes('registered')
      ) {
        setUserExists(true);
        setToast({
          message: 'User already registered! Please sign in instead.',
          type: 'info',
          isVisible: true
        });
        setTimeout(() => {
          navigate('/signin');
        }, 2500);
      } else {
        setError(errorMessage);
      }
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout imageSrc={sampleImage}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex items-center mb-6">
          <img src={logo} alt="HD Logo" className="h-8 w-auto mr-2" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
        <p className="text-gray-600 mb-6">Sign up to enjoy the feature of HD</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {userExists && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <p>User already registered! Please sign in instead.</p>
            <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Go to Sign In
            </Link>
          </div>
        )}

        {/* Email OTP Form */}
        <form className="flex flex-col space-y-4 mb-6">
          <Input 
            label="Your Name" 
            type="text" 
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            disabled={userExists}
          />
          
          <Input 
            label="Date of Birth" 
            type="date" 
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            required
            disabled={userExists}
          />
          
          <Input 
            label="Email" 
            type="email" 
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            disabled={userExists}
          />

          <Button 
            type="submit" 
            onClick={handleGetOtp}
            className="mt-6"
            disabled={loading || userExists}
          >
            {loading ? 'Sending OTP...' : 'Get OTP'}
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
          <GoogleAuth disabled={userExists} />
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account?? </span>
          <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </AuthLayout>
  );
};

export default SignUp;
