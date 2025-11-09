// Utility to replace localhost URLs with environment variables
// This file can be deleted after migration

import { getApiUrl } from '../config/env';

// URL mapping for common endpoints
export const urlMap = {
  // Auth endpoints
  'http://localhost:5001/api/auth/login-user': () => getApiUrl('/auth/login-user'),
  'http://localhost:5001/api/auth/register-user': () => getApiUrl('/auth/register-user'),
  'http://localhost:5001/api/auth/verify-phone-registration': () => getApiUrl('/auth/verify-phone-registration'),
  'http://localhost:5001/api/auth/verify-sms': () => getApiUrl('/auth/verify-sms'),
  'http://localhost:5001/api/auth/google': () => getApiUrl('/auth/google'),

  
  // User endpoints
  'http://localhost:5001/api/users/me': () => getApiUrl('/users/me'),
  'http://localhost:5001/api/users': () => getApiUrl('/users'),
  
  // CV endpoints
  'http://localhost:5001/api/cv/save': () => getApiUrl('/cv/save'),
  'http://localhost:5001/api/cv/get': () => getApiUrl('/cv/get'),
  
  // Job endpoints
  'http://localhost:5001/api/jobs': () => getApiUrl('/jobs'),
  'http://localhost:5001/api/jobs/employer/my-jobs': () => getApiUrl('/jobs/employer/my-jobs'),
  
  // Employer endpoints
  'http://localhost:5001/api/employers/profile': () => getApiUrl('/employers/profile'),
  'http://localhost:5001/api/employers/save-profile': () => getApiUrl('/employers/save-profile'),
  'http://localhost:5001/api/employers/change-password': () => getApiUrl('/employers/change-password'),
};

// Helper function to get correct URL
export const getCorrectUrl = (endpoint: string): string => {
  const mapper = urlMap[endpoint as keyof typeof urlMap];
  return mapper ? mapper() : endpoint;
}; 