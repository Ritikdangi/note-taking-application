

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface SignUpData {
  name: string;
  dob: string;
  email: string;
}

export interface SignInData {
  email: string;
  otp?: string;
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

export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  color?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  color?: string;
  tags?: string[];
}

export interface NotesResponse {
  notes: Note[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotes: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json', 
      }
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

     
  async resendOtp(data: SignInData ): Promise<OtpResponse>{
    return this.request<OtpResponse>('/auth/resend-otp', {
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

  // Note operations
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  // Create a new note
  async createNote(data: CreateNoteData): Promise<Note> {
    return this.request<Note>('/notes/create', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  // Get all notes for the user
  async getNotes(page: number = 1, limit: number = 10, search?: string, color?: string): Promise<NotesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) params.append('search', search);
    if (color) params.append('color', color);

    return this.request<NotesResponse>(`/notes/get?${params.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  // Get a single note by ID
  async getNoteById(id: string): Promise<Note> {
    return this.request<Note>(`/notes/get/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  // Update a note
  async updateNote(id: string, data: Partial<CreateNoteData>): Promise<Note> {
    return this.request<Note>(`/notes/update/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  // Delete a note
  async deleteNote(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/notes/remove/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }
}

export const apiService = new ApiService();
