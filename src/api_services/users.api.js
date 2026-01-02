import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/users`,
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('abhyaasi_authToken');
      localStorage.removeItem('abhyaasi_user');
    }
    return Promise.reject(error);
  }
);

// Auth & Registration
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const registerOrLoginViaGoogle = async (userData) => {
  try {
    const response = await axiosInstance.post('/register_or_login_via_oauth', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const forgotPassword = async (email, password) => {
  try {
    const response = await axiosInstance.post('/forgot_password', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Password Management
export const forgotPasswordSendOTP = async (email) => {
  try {
    const response = await axiosInstance.post('/forgot_password_send_otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const forgotPasswordVerifyOTP = async (email, otp) => {
  try {
    const response = await axiosInstance.post('/forgot_password_verify_otp', { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const resetPassword = async (passwordData) => {
  try {
    const response = await axiosInstance.post('/reset_password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Profile Operations
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addOrUpdateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/add_OR_update_profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUser = async () => {
  try {
    const response = await axiosInstance.get('/get_user');
    console.log("getUser response:", response);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/get_all_users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Activity Tracking
export const trackUserActivity = async (activityData) => {
  try {
    const response = await axiosInstance.put('/track_user_activity', activityData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Image Upload
export const uploadImage = async (file) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/users/upload-image`,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateEmail = async (email, otp) => {
  try {
    const response = await axiosInstance.put('/update_email', { email, otp });
    return response.data;
  }
  catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteAccount = async (otp) => {
  try {
    const response = await axiosInstance.post('/delete_user', { otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const trackActivity = async () => {
  try {
    const response = await axiosInstance.put('/track_user_activity');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const downloadCertificate = async (certificateUrl, filename) => {
  try {
    const response = await axiosInstance.post(
      '/download-certificate',
      {
        certificateUrl,
        filename
      },
      {
        responseType: 'blob'
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default axiosInstance;
