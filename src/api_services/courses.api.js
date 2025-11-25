import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/courses`,
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
export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get('/get_all');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCourseById = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCourseBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Enrollment Operations
export const enrollInCourse = async (courseId) => {
  try {
    const response = await axiosInstance.post(`/enroll/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const unenrollFromCourse = async (courseId) => {
  try {
    const response = await axiosInstance.post('/unenroll', { courseId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Operations
export const createCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/create', courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axiosInstance.put(`/update/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const toggleCourseVisibility = async (courseId) => {
  try {
    const response = await axiosInstance.put(`/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeCourse = async (courseId) => {
  try {
    const response = await axiosInstance.delete(`/delete/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default axiosInstance;
