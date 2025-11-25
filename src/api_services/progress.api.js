import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/progress`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('abhyaasi_authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Progress Reports
export const getOverallProgressReport = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCourseProgressReport = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default axiosInstance;
