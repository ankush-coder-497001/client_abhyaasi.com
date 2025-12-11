import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/modules`,
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
export const getModule = async (moduleId) => {
  try {
    const response = await axiosInstance.get(`/get/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyModules = async () => {
  try {
    const response = await axiosInstance.get('/get_my_module');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Submission Operations
export const submitMCQ = async (moduleId, submissionData) => {
  try {
    const response = await axiosInstance.post(`/submit-mcq/${moduleId}`, submissionData);
    return response.data;
  } catch (error) {
    console.log("Error in submitMCQ:", error);
    throw error.response?.data || error;
  }
};

export const submitCode = async (moduleId, codeData) => {
  try {
    const response = await axiosInstance.post(`/submit-code/${moduleId}`, codeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin Operations
export const createModule = async (moduleData) => {
  try {
    const response = await axiosInstance.post('/create', moduleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const editModule = async (moduleId, moduleData) => {
  try {
    const response = await axiosInstance.put(`/edit/${moduleId}`, moduleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeModule = async (moduleId) => {
  try {
    const response = await axiosInstance.delete(`/remove/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default axiosInstance;
