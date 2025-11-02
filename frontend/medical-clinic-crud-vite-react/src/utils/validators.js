// src/utils/validators.js

export const validateRequired = (value) => {
    return value ? null : 'This field is required';
};

export const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value) ? null : 'Invalid email address';
};

export const validatePhoneNumber = (value) => {
    const phonePattern = /^\d{10}$/; // Example for a 10-digit phone number
    return phonePattern.test(value) ? null : 'Invalid phone number';
};

export const validateDate = (value) => {
    return !isNaN(Date.parse(value)) ? null : 'Invalid date';
};

// Add more validation functions as needed for other fields and requirements.