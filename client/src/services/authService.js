// Authentication service for connecting to PostgreSQL backend
import apiService from './apiService';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'auth_token';
    this.REFRESH_TOKEN_KEY = 'refresh_token';
  }

  // Store token in localStorage with security considerations
  setToken(token, refreshToken = null) {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }

  // Get token from localStorage
  getToken() {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  // Get refresh token from localStorage
  getRefreshToken() {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  // Remove tokens from localStorage
  removeToken() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove tokens:', error);
    }
  }

  // Decode JWT token payload
  decodeToken(token) {
    try {
      if (!token || typeof token !== 'string') return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token) {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    
    // Add 30 second buffer to account for clock skew
    return payload.exp < (Date.now() / 1000) + 30;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    return !this.isTokenExpired(token);
  }

  // Get current user from token
  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    if (!payload) return null;

    // Return user info from token payload
    return {
      id: payload.userId || payload.id,
      email: payload.email,
      name: payload.name,
      exp: payload.exp,
      iat: payload.iat
    };
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.auth.refresh(refreshToken);

      if (response.data && response.data.data && response.data.data.token) {
        this.setToken(response.data.data.token, response.data.data.refreshToken);
        return { success: true, token: response.data.data.token };
      } else {
        this.removeToken();
        return { success: false, error: response.data.message || 'Token refresh failed' };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.removeToken();
      return { success: false, error: 'Network error during token refresh' };
    }
  }

  // Register new user
  async register(userData) {
    try {
      // Validate required fields
      if (!userData.email || !userData.password || !userData.name) {
        return { success: false, error: 'Email, password, and name are required' };
      }

      const response = await apiService.auth.register(userData);

      if (response.data && response.data.data && response.data.data.token) {
        this.setToken(response.data.data.token, response.data.data.refreshToken);
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      }
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Login user
  async login(credentials) {
    try {
      // Validate required fields
      if (!credentials.email || !credentials.password) {
        return { success: false, error: 'Email and password are required' };
      }

      const response = await apiService.auth.login(credentials);

      if (response.data && response.data.data && response.data.data.token) {
        this.setToken(response.data.data.token, response.data.data.refreshToken);
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      }
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Logout user
  logout() {
    this.removeToken();
    // Don't force redirect, let the app handle it
  }

  // Get user profile
  async getProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await apiService.auth.profile();

      if (response.data) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message || 'Failed to get profile' };
      }
    } catch (error) {
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
      }
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Make authenticated API requests with automatic token refresh
  async authenticatedRequest(url, options = {}) {
    try {
      // Remove the base URL if it's already included
      const cleanUrl = url.replace(apiService.getBaseURL(), '');
      
      // Use the appropriate HTTP method
      const method = options.method?.toLowerCase() || 'get';
      const data = options.body ? JSON.parse(options.body) : undefined;
      
      let response;
      switch (method) {
        case 'post':
          response = await apiService.post(cleanUrl, data);
          break;
        case 'put':
          response = await apiService.put(cleanUrl, data);
          break;
        case 'patch':
          response = await apiService.patch(cleanUrl, data);
          break;
        case 'delete':
          response = await apiService.delete(cleanUrl);
          break;
        default:
          response = await apiService.get(cleanUrl);
      }
      
      // Return a fetch-like response object for compatibility
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        json: () => Promise.resolve(response.data),
        text: () => Promise.resolve(JSON.stringify(response.data)),
      };
    } catch (error) {
      if (error.response) {
        // Return error response in fetch-like format
        return {
          ok: false,
          status: error.response.status,
          json: () => Promise.resolve(error.response.data),
          text: () => Promise.resolve(JSON.stringify(error.response.data)),
        };
      }
      throw error;
    }
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check if user has specific permissions (for future use)
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user || !user.permissions) return false;
    
    return user.permissions.includes(permission);
  }

  // Get user's role (for future use)
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || 'user';
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;