import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`, {
            refreshToken
          });

          if (response.data?.data?.token) {
            // Update tokens
            localStorage.setItem('auth_token', response.data.data.token);
            if (response.data.data.refreshToken) {
              localStorage.setItem('refresh_token', response.data.data.refreshToken);
            }

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        // You can dispatch a logout action here if using Redux/Context
      }
    }

    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Generic HTTP methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),

  // Authentication endpoints
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials),
    register: (userData) => apiClient.post('/api/auth/register', userData),
    refresh: (refreshToken) => apiClient.post('/api/auth/refresh', { refreshToken }),
    profile: () => apiClient.get('/api/auth/profile'),
    logout: () => apiClient.post('/api/auth/logout'),
  },

  // Resume endpoints
  resumes: {
    getAll: () => apiClient.get('/api/resumes'),
    getById: (id) => apiClient.get(`/api/resumes/${id}`),
    create: (resumeData) => apiClient.post('/api/resumes', resumeData),
    update: (id, resumeData) => apiClient.put(`/api/resumes/${id}`, resumeData),
    delete: (id) => apiClient.delete(`/api/resumes/${id}`),
    getSuggestions: () => apiClient.get('/api/resumes/suggestions'),
  },

  // AI Enhancement endpoints
  ai: {
    enhance: (section, data) => apiClient.post('/api/enhance', { section, data }),
  },

  // Utility methods
  setAuthToken: (token) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('auth_token', token);
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth_token');
    }
  },

  clearAuth: () => {
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  // Get base URL for external use
  getBaseURL: () => apiClient.defaults.baseURL,
};

export default apiService;
export { apiClient };