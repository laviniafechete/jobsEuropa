import config from '../config.js';

export const validateEmail = (email) => {
  return config.validation.emailRegex.test(email);
};

export const validatePhone = (phone) => {
  return config.validation.phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= config.validation.passwordMinLength;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} is required`);
  }
  return true;
};

export const validateLength = (value, fieldName, min, max) => {
  if (value && typeof value === 'string') {
    if (min && value.length < min) {
      throw new Error(`${fieldName} must be at least ${min} characters long`);
    }
    if (max && value.length > max) {
      throw new Error(`${fieldName} cannot exceed ${max} characters`);
    }
  }
  return true;
};

export const validateEnum = (value, fieldName, allowedValues) => {
  if (value && !allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
  return true;
};

export const validateArray = (value, fieldName, minLength = 0, maxLength = null) => {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  if (value.length < minLength) {
    throw new Error(`${fieldName} must have at least ${minLength} items`);
  }
  if (maxLength && value.length > maxLength) {
    throw new Error(`${fieldName} cannot have more than ${maxLength} items`);
  }
  return true;
};

export const validateDate = (date, fieldName) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }
  return true;
};

export const validateSalary = (salary) => {
  if (salary) {
    if (salary.min && salary.max && salary.min > salary.max) {
      throw new Error('Minimum salary cannot be greater than maximum salary');
    }
    if (salary.min && salary.min < 0) {
      throw new Error('Minimum salary cannot be negative');
    }
    if (salary.max && salary.max < 0) {
      throw new Error('Maximum salary cannot be negative');
    }
  }
  return true;
};

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};

export const validateFileUpload = (file) => {
  if (!file) {
    throw new Error('No file uploaded');
  }
  
  if (file.size > config.upload.maxSize) {
    throw new Error(`File size must be less than ${config.upload.maxSize / (1024 * 1024)}MB`);
  }
  
  if (!config.upload.allowedTypes.includes(file.mimetype)) {
    throw new Error(`File type not allowed. Allowed types: ${config.upload.allowedTypes.join(', ')}`);
  }
  
  return true;
}; 