import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface CompanyProfile {
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
  logoUrl?: string;
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
  hasProfileCompleted?: boolean;
  companyProfile?: CompanyProfile;
  subscriptionActive?: boolean;
  subscriptionType?: 'none' | 'basic' | 'premium' | 'single' | 'promotion';
  subscriptionEnd?: string;
  trialStart?: string;
  trialEnd?: string;
}

export interface AuthState {
  // State
  user: User | null;
  employer: Employer | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  userType: 'user' | 'employer' | null;

  // Actions
  login: (token: string, userType: 'user' | 'employer', userData: User | Employer) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (userData: Partial<User>) => void;
  updateEmployer: (employerData: Partial<Employer>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      employer: null,
      token: null,
      isLoading: false,
      error: null,
      userType: null,

      // Actions
      login: (token: string, userType: 'user' | 'employer', userData: User | Employer) => {
        console.log("Login called with:", { token, userType, userData });
        
        if (userType === 'user') {
          set({
            user: userData as User,
            employer: null,
            token,
            userType: 'user',
            error: null,
          });
        } else {
          set({
            employer: userData as Employer,
            user: null,
            token,
            userType: 'employer',
            error: null,
          });
        }
        
        console.log("Login completed - new state:", get());
      },

      logout: () => {
        console.log("Logout called");
        set({
          user: null,
          employer: null,
          token: null,
          userType: null,
          error: null,
        });
        console.log("Logout completed - new state:", get());
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      updateEmployer: (employerData: Partial<Employer>) => {
        const { employer } = get();
        if (employer) {
          set({ employer: { ...employer, ...employerData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        employer: state.employer,
        token: state.token,
        userType: state.userType,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Store rehydrated:", state);
      },
    }
  )
); 