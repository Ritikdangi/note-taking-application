import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleAuthProps {
  disabled?: boolean;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ disabled = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (disabled) return;

    const google = window.google;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!google || !clientId) {
      console.error('Google OAuth not loaded or Client ID missing');
      return;
    }

    google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        try {
          const result = await apiService.googleAuth({ token: response.credential });
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          navigate('/dashboard');
        } catch (error) {
          console.error('Google auth error:', error);
        }
      }
    });

    google.accounts.id.renderButton(
      document.getElementById('google-button')!,
      {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        logo_alignment: 'left',
      }
    );
  }, [disabled, navigate]);

  return (
    <div className={`w-full flex justify-center ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div id="google-button" />
    </div>
  );
};

export default GoogleAuth;
