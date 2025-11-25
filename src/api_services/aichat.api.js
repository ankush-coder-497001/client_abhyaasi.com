import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/AI`,
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

// AI Chat Operations
export const sendMessage = async (message) => {
  try {
    const response = await axiosInstance.post('/chat', { message });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const sendVoiceChat = async (voiceData) => {
  try {
    const response = await axiosInstance.post('/voice-chat', voiceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const chatWithRelatedPlatform = async (message) => {
  try {
    const response = await axiosInstance.post('/chat-related-platform', { message });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default axiosInstance;
