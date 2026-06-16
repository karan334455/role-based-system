import axiosInstance from '@/app/axios';

// Login
export const loginUser = async (payload) => {
  return axiosInstance.post('/auth/login', payload);
};

// Register
export const registerUser = async (payload) => {
  return axiosInstance.post('/auth/register', payload);
};

// Verify OTP
export const verifyOtp = async (payload) => {
  // Note: baseURL already includes /api, so we use /auth/verify-otp
  return axiosInstance.post('/auth/verify-otp', payload);
};

// Resend OTP
export const resendOtp = async (payload) => {
  return axiosInstance.post('/auth/resend-otp', payload);
};

// Forgot Password
export const forgotPassword = async (payload) => {
  return axiosInstance.post('/auth/forgot-password', payload);
};

// Reset Password
export const resetPassword = async (payload) => {
  return axiosInstance.post('/auth/reset-password', payload);
};
