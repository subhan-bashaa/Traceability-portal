import { apiClient } from './api';

const TOKEN_KEY = 'fynd_auth_token';
const USER_KEY = 'fynd_auth_user';

/**
 * Configure Axios request interceptor to automatically attach JWT to protected requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Enterprise Authentication Service
 * Communicates with backend endpoints:
 *   POST /api/auth/signup
 *   POST /api/auth/login
 *   GET  /api/auth/me
 *   POST /api/auth/logout
 */
export const authService = {
  /**
   * Retrieve currently stored JWT from browser storage
   */
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Retrieve currently stored user profile
   */
  getUser() {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if an active session exists
   */
  isAuthenticated() {
    return Boolean(this.getToken() && this.getUser());
  },

  /**
   * Securely store session metadata
   * NEVER stores plain passwords or sensitive credentials
   */
  saveSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) {
      // Whitelist only safe user attributes
      const safeUser = {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'buyer',
      };
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
    }
  },

  /**
   * Clear session credentials
   */
  clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // Ignore storage errors
    }
  },

  /**
   * Authenticate user with email and password
   * Expected payload: { email, password }
   */
  async login({ email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      const response = await apiClient.post('/auth/login', {
        email: cleanEmail,
        password,
      });

      if (response.data?.success && response.data?.token) {
        this.saveSession(response.data.token, response.data.user);
        return {
          success: true,
          token: response.data.token,
          user: response.data.user,
        };
      }

      throw new Error(response.data?.message || 'Login failed. Please check your credentials.');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 401 || error.response?.status === 400) {
        throw new Error('Invalid email or password.');
      }
      if (error.code === 'ECONNABORTED' || !error.response) {
        throw new Error('Unable to connect to the server. Please try again.');
      }
      throw new Error(error.message || 'Authentication error encountered.');
    }
  },

  /**
   * Register a new user account
   * Expected payload: { name, email, password, role }
   */
  async signup({ name, email, password, role }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    try {
      const response = await apiClient.post('/auth/signup', {
        name: cleanName,
        email: cleanEmail,
        password,
        role: role || 'buyer',
      });

      if (response.data?.success) {
        // If the backend automatically authenticates upon signup
        if (response.data.token && response.data.user) {
          this.saveSession(response.data.token, response.data.user);
        }

        return {
          success: true,
          message: response.data.message || 'Account created successfully.',
          token: response.data.token,
          user: response.data.user,
        };
      }

      throw new Error(response.data?.message || 'Failed to create account.');
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 409) {
        throw new Error('An account with this email already exists.');
      }
      if (error.code === 'ECONNABORTED' || !error.response) {
        throw new Error('Unable to connect to the server. Please try again.');
      }
      throw new Error(error.message || 'Account registration failed.');
    }
  },

  /**
   * Fetch current authenticated user session from backend
   */
  async getMe() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await apiClient.get('/auth/me');
      if (response.data?.success && response.data?.user) {
        this.saveSession(token, response.data.user);
        return response.data.user;
      }
      return this.getUser();
    } catch {
      // If token expired/invalid, clear session
      this.clearSession();
      return null;
    }
  },

  /**
   * Terminate session
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      this.clearSession();
    }
  },
};

export default authService;
