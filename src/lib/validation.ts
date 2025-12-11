/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class Validator {
  static email(email: string): ValidationResult {
    if (!email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
  }

  static password(password: string): ValidationResult {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one special character' };
    }

    return { isValid: true };
  }

  static fullName(name: string): ValidationResult {
    if (!name.trim()) {
      return { isValid: false, error: 'Full name is required' };
    }

    if (name.trim().length < 2) {
      return { isValid: false, error: 'Full name must be at least 2 characters long' };
    }

    // Check if name contains at least first and last name
    const nameParts = name.trim().split(' ').filter(part => part.length > 0);
    if (nameParts.length < 2) {
      return { isValid: false, error: 'Please enter your full name (first and last name)' };
    }

    return { isValid: true };
  }

  static required(value: string, fieldName: string): ValidationResult {
    if (!value.trim()) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
  }
}