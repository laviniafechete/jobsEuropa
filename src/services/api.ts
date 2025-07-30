import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config/env';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Commented out to avoid duplicate error messages
    // Let components handle error messages locally
    /*
    const message = error.response?.data?.error?.message || error.response?.data?.message || 'A apărut o eroare';
    
    // Import snackbar store dynamically to avoid circular dependencies
    import('../stores/snackbarStore').then(({ useSnackbarStore }) => {
      useSnackbarStore.getState().addMessage(message, 'error');
    });
    */
    
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T = any> {
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
  // Save company profile
  saveCompanyProfile: async (profileData: any): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/employer/company-profile', profileData);
    return response.data;
  },

  // Get company profile
  getCompanyProfile: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/employer/company-profile');
    return response.data;
  },

  // Post job
  postJob: async (jobData: any): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/employer/post-job', jobData);
    return response.data;
  },

  // Get jobs
  getJobs: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/employer/jobs');
    return response.data;
  },

  // Get employees
  getEmployees: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/employer/employees');
    return response.data;
  },

  // Stripe: inițiere sesiune checkout
  createStripeCheckoutSession: async (priceId: string): Promise<{ url: string }> => {
    const response = await api.post('/employer/stripe/create-checkout-session', { priceId });
    return response.data;
  },
};

// User API methods
export const userAPI = {
  // Get user info
  getUserInfo: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/user/info');
    return response.data;
  },

  // Update applied jobs
  updateAppliedJobs: async (jobId: string, action: 'apply' | 'remove'): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.put('/user/applied-jobs', { jobId, action });
    return response.data;
  },

  // Get applied jobs
  getAppliedJobs: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.get('/user/applied-jobs');
    return response.data;
  },
};

export default api; 