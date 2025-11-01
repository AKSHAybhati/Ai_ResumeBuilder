// Authentication service for connecting to PostgreSQL backend
const API_BASE = 'http://localhost:5000/api';

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

      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.data && data.data.token) {
        this.setToken(data.data.token, data.data.refreshToken);
        return { success: true, token: data.data.token };
      } else {
        this.removeToken();
        return { success: false, error: data.message || 'Token refresh failed' };
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

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.data && data.data.token) {
        this.setToken(data.data.token, data.data.refreshToken);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
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

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.data && data.data.token) {
        this.setToken(data.data.token, data.data.refreshToken);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
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

      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.message || 'Failed to get profile' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Make authenticated API requests with automatic token refresh
  async authenticatedRequest(url, options = {}) {
    let token = this.getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    // Check if token is expired and try to refresh
    if (this.isTokenExpired(token)) {
      const refreshResult = await this.refreshAccessToken();
      if (refreshResult.success) {
        token = refreshResult.token;
      } else {
        throw new Error('Session expired. Please login again.');
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Try to refresh token once more
      const refreshResult = await this.refreshAccessToken();
      if (refreshResult.success) {
        // Retry the request with new token
        const retryHeaders = {
          ...headers,
          'Authorization': `Bearer ${refreshResult.token}`,
        };
        
        return await fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      } else {
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
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