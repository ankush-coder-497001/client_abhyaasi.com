import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/professions`,
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

// Get Operations
export const getProfession = async (professionId) => {
  try {
    const response = await axiosInstance.get(`/get/${professionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Enrollment Operations
export const enrollInProfession = async (professionId) => {
  try {
    const response = await axiosInstance.post(`/enroll/${professionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const unenrollFromProfession = async (professionId) => {
  try {
    const response = await axiosInstance.post(`/unenroll/${professionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Operations
export const createProfession = async (professionData) => {
  try {
    const response = await axiosInstance.post('/create', professionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const assignCourses = async (professionId, courseIds) => {
  try {
    const response = await axiosInstance.post(`/assign_courses/${professionId}`, { courseIds });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const toggleProfessionVisibility = async (professionId) => {
  try {
    const response = await axiosInstance.put(`/${professionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default axiosInstance;
