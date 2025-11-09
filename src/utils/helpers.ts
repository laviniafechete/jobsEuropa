import { clsx, type ClassValue } from 'clsx';

// Class name utility
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'RON'): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'relative') {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'acum câteva secunde';
    if (diffInSeconds < 3600) return `acum ${Math.floor(diffInSeconds / 60)} minute`;
    if (diffInSeconds < 86400) return `acum ${Math.floor(diffInSeconds / 3600)} ore`;
    if (diffInSeconds < 2592000) return `acum ${Math.floor(diffInSeconds / 86400)} zile`;
    if (diffInSeconds < 31536000) return `acum ${Math.floor(diffInSeconds / 2592000)} luni`;
    return `acum ${Math.floor(diffInSeconds / 31536000)} ani`;
  }
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return dateObj.toLocaleDateString('ro-RO');
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (Romanian format)
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+40|0)[0-9]{9}$/;
  return phoneRegex.test(phone);
}

// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 6) {
    errors.push('Parola trebuie să aibă cel puțin 6 caractere');
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Convert experience level to display text
export function getExperienceDisplay(level: string): string {
  const experienceMap: Record<string, string> = {
    'entry': 'Începător',
    'junior': 'Junior',
    'mid': 'Mid-level',
    'senior': 'Senior',
    'lead': 'Lead',
  };
  
  return experienceMap[level] || level;
}

// Convert job type to display text
export function getJobTypeDisplay(type: string): string {
  const typeMap: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    'contract': 'Contract',
    'internship': 'Internship',
  };
  
  return typeMap[type] || type;
}

// Convert language level to display text
export function getLanguageLevelDisplay(level: string): string {
  const levelMap: Record<string, string> = {
    'beginner': 'Începător',
    'intermediate': 'Intermediar',
    'advanced': 'Avansat',
    'native': 'Nativ',
  };
  
  return levelMap[level] || level;
}

// Get salary range display
export function getSalaryDisplay(salary: { min?: number; max?: number; currency?: string }): string {
  if (!salary) return 'Salariu negociabil';
  
  const { min, max, currency = 'RON' } = salary;
  
  if (min && max) {
    return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
  }
  
  if (min) {
    return `De la ${formatCurrency(min, currency)}`;
  }
  
  if (max) {
    return `Până la ${formatCurrency(max, currency)}`;
  }
  
  return 'Salariu negociabil';
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if file is image
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry function
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      await sleep(delay * attempt);
    }
  }
  
  throw lastError!;
} 