import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/env';

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;

    const persisted = localStorage.getItem('auth-storage');
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        token = parsed?.state?.token ?? null;
      } catch (error) {
        console.warn('Failed to parse auth-storage', error);
      }
    }

    if (!token) {
      token = localStorage.getItem('token');
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      
      // Redirect to login
      if (window.location.pathname !== '/employee/login' && 
          window.location.pathname !== '/employer/login' &&
          window.location.pathname !== '/') {
        window.location.href = '/';
      }
      
      return Promise.reject(error);
    }
    
    // Handle network errors with retry
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      // Don't retry for now, just reject
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    message: string;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterEmployerRequest {
  companyName: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  userId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  hasCompletedCv: boolean;
  isActive: boolean;
  appliedJobs: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface Employer {
  _id: string;
  userId: string;
  companyName: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface AuthResponse {
  user?: User;
  employer?: Employer;
  token: string;
}

export interface EmployerCompanyProfilePayload {
  name?: string;
  cui?: string;
  location?: string;
  domain?: string;
  description?: string;
  contactPerson?: string;
  position?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface JobPayload {
  title: string;
  description: string;
  requirements?: string;
  location: string;
  type: string;
  experience: string;
  category: string;
  salary?: {
    min?: number | null;
    max?: number | null;
    currency?: string;
  };
  skills?: string[];
  benefits?: string[];
  isActive?: boolean;
}

export interface StripeCheckoutResponse {
  url: string;
}

// Auth API methods
export const authAPI = {
  // User registration
  registerUser: async (data: RegisterUserRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/register-user', data);
    return response.data;
  },

  // Employer registration
  registerEmployer: async (data: RegisterEmployerRequest): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/register-employer', data);
    return response.data;
  },

  // User login
  loginUser: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post('/auth/login-user', data);
    return response.data;
  },

  // Employer login
  loginEmployer: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post('/auth/login-employer', data);
    return response.data;
  },

  // Get user info
  getUserInfo: async (): Promise<ApiResponse<User | Employer>> => {
    const response: AxiosResponse<ApiResponse<User | Employer>> = await api.get('/auth/me');
    return response.data;
  },

  // Email verification
  verifyEmail: async (userType: 'user' | 'employer', token: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(`/auth/verify-email/${userType}/${token}`);
    return response.data;
  },

  // Manual email verification
  verifyEmailManual: async (userType: 'user' | 'employer', userId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get(`/auth/verify-email-manual/${userType}/${userId}`);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: { email?: string; phone?: string; userType: string }): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/reset-password', data);
    return response.data;
  },
};

// CV API methods
export const cvAPI = {
  // Save CV
  saveCV: async (cvData: FormData): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/cv/save', cvData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get CV
  getCV: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/cv/get');
    return response.data;
  },

  // Update CV status
  updateCVStatus: async (status: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.put('/cv/status', { status });
    return response.data;
  },
};

// Employer API methods
export const employerAPI = {
  saveCompanyProfile: async (profileData: EmployerCompanyProfilePayload): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/employers/save-profile', profileData);
    return response.data;
  },

  getCompanyProfile: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/employers/profile');
    return response.data;
  },

  postJob: async (jobData: JobPayload): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/jobs', jobData);
    return response.data;
  },

  getJobs: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/jobs/employer/my-jobs');
    return response.data;
  },

  getEmployees: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/users');
    return response.data;
  },

  createStripeCheckoutSession: async (priceId: string): Promise<StripeCheckoutResponse> => {
    const response: AxiosResponse<StripeCheckoutResponse> = await api.post('/employers/stripe/create-checkout-session', { priceId });
    return response.data;
  },
};

// User API methods
export const userAPI = {
  getUserInfo: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/users/info');
    return response.data;
  },

  updateAppliedJobs: async (jobId: string, action: 'apply' | 'remove'): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.put('/users/applied-jobs', { jobId, action });
    return response.data;
  },

  getAppliedJobs: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/users/applied-jobs');
    return response.data;
  },
};

export default api; 