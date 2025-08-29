

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface SignUpData {
  name: string;
  dob: string;
  email: string;
}

export interface SignInData {
  email: string;
  otp: string;
}

export interface GoogleAuthData {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface OtpResponse {
  message: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json();
  }

  // Send OTP for signup
  async sendOtp(data: SignUpData): Promise<OtpResponse> {
    return this.request<OtpResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Verify OTP and complete signup/signin
  async verifyOtp(data: SignInData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Google OAuth
  async googleAuth(data: GoogleAuthData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
