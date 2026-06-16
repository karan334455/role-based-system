import axiosInstance from '@/app/axios';

// Fetch activities from backend API
export const getActivities = async () => {
  return axiosInstance.get('/activities');
};
