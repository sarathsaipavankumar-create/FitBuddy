/**
 * ============================================================================
 * FitBuddy - Unified Client API Service (api.js)
 * Connects frontend interfaces (Website & Android WebView) to the
 * Spring Boot REST backend with MySQL persistence.
 * ============================================================================
 */

(function (window) {
  'use strict';

  // Determine initial API Base URL
  function detectInitialBaseUrl() {
    const saved = localStorage.getItem('fitbuddy_api_base');
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }

    // If running in browser over HTTP / HTTPS
    if (window.location && window.location.hostname) {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080';
      }
      return `${window.location.protocol}//${hostname}:8080`;
    }

    // Android WebView / file:///android_asset/ environment
    // Use emulator loopback or host LAN address
    return 'http://10.0.2.2:8080';
  }

  let API_BASE_URL = detectInitialBaseUrl();

  const FitBuddyApi = {
    // URL Configuration
    getBaseUrl: function () {
      return API_BASE_URL;
    },

    setBaseUrl: function (url) {
      if (url && typeof url === 'string') {
        API_BASE_URL = url.trim().replace(/\/+$/, '');
        try {
          localStorage.setItem('fitbuddy_api_base', API_BASE_URL);
        } catch (e) {}
      }
    },

    // Auth Token Management
    getToken: function () {
      try {
        return localStorage.getItem('fitbuddy_auth_token') || sessionStorage.getItem('fitbuddy_auth_token') || null;
      } catch (e) {
        return null;
      }
    },

    setToken: function (token) {
      try {
        if (token) {
          localStorage.setItem('fitbuddy_auth_token', token);
          sessionStorage.setItem('fitbuddy_auth_token', token);
        } else {
          localStorage.removeItem('fitbuddy_auth_token');
          sessionStorage.removeItem('fitbuddy_auth_token');
        }
      } catch (e) {}
    },

    // Cached User Management
    getCurrentUser: function () {
      try {
        const raw = localStorage.getItem('fitbuddy_user') || sessionStorage.getItem('fitbuddy_user');
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    setCurrentUser: function (user) {
      try {
        if (user) {
          const raw = JSON.stringify(user);
          localStorage.setItem('fitbuddy_user', raw);
          sessionStorage.setItem('fitbuddy_user', raw);
          if (user.fullName) {
            sessionStorage.setItem('fitbuddy_demo_user_name', user.fullName);
          }
          if (user.profile) {
            localStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(user.profile));
            sessionStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(user.profile));
          }
        } else {
          localStorage.removeItem('fitbuddy_user');
          sessionStorage.removeItem('fitbuddy_user');
        }
      } catch (e) {}
    },

    isLoggedIn: function () {
      return Boolean(this.getToken());
    },

    clearAuth: function () {
      this.setToken(null);
      this.setCurrentUser(null);
    },

    // Core HTTP Request Wrapper
    request: async function (endpoint, options = {}) {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = {
        'Accept': 'application/json',
        ...(options.headers || {})
      };

      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config = {
        ...options,
        headers
      };

      try {
        const response = await fetch(url, config);

        // Handle 401 Unauthorized
        if (response.status === 401) {
          this.clearAuth();
          // If not currently on login or register, can notify
          if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
            console.warn('Session expired or unauthorized.');
          }
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage = (data && (data.message || (data.errors && data.errors.join(', ')))) ||
                                `Request failed with status ${response.status}`;
          const error = new Error(errorMessage);
          error.status = response.status;
          error.data = data;
          throw error;
        }

        return data;
      } catch (err) {
        // Fallback for Android emulator/LAN discovery if primary candidate is unreachable
        if (err.name === 'TypeError' && err.message.includes('fetch') && API_BASE_URL.includes('10.0.2.2')) {
          console.warn('10.0.2.2 unreachable, attempting LAN fallback 10.148.131.129...');
          API_BASE_URL = 'http://10.148.131.129:8080';
          return this.request(endpoint, options);
        }
        throw err;
      }
    },

    // -------------------------------------------------------------
    // Authentication Endpoints
    // -------------------------------------------------------------
    register: async function (fullName, email, password) {
      const res = await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password })
      });
      if (res && res.data) {
        this.setToken(res.data.token);
        this.setCurrentUser(res.data.user);
      }
      return res;
    },

    login: async function (email, password) {
      const res = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res && res.data) {
        this.setToken(res.data.token);
        this.setCurrentUser(res.data.user);
      }
      return res;
    },

    fetchCurrentUser: async function () {
      const res = await this.request('/api/auth/me', { method: 'GET' });
      if (res && res.data) {
        this.setCurrentUser(res.data);
      }
      return res;
    },

    logout: async function () {
      try {
        await this.request('/api/auth/logout', { method: 'POST' });
      } catch (e) {
        // ignore logout failure on network error
      } finally {
        this.clearAuth();
      }
    },

    // -------------------------------------------------------------
    // User Profile Endpoints
    // -------------------------------------------------------------
    getProfile: async function () {
      const res = await this.request('/api/user/profile', { method: 'GET' });
      if (res && res.data) {
        try {
          localStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(res.data));
          sessionStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(res.data));
        } catch (e) {}
      }
      return res;
    },

    updateProfile: async function (profileData) {
      const res = await this.request('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      if (res && res.data) {
        try {
          localStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(res.data));
          sessionStorage.setItem('fitbuddy_demo_profile_data', JSON.stringify(res.data));
        } catch (e) {}
      }
      return res;
    },

    // -------------------------------------------------------------
    // Workouts Endpoints
    // -------------------------------------------------------------
    logWorkout: async function (workoutData) {
      return await this.request('/api/workouts/log', {
        method: 'POST',
        body: JSON.stringify(workoutData)
      });
    },

    getWorkoutHistory: async function () {
      return await this.request('/api/workouts/history', { method: 'GET' });
    },

    // -------------------------------------------------------------
    // Progress Tracking Endpoints
    // -------------------------------------------------------------
    logProgress: async function (progressData) {
      return await this.request('/api/progress/log', {
        method: 'POST',
        body: JSON.stringify(progressData)
      });
    },

    getProgressHistory: async function () {
      return await this.request('/api/progress/history', { method: 'GET' });
    },

    deleteProgress: async function (id) {
      return await this.request(`/api/progress/${id}`, { method: 'DELETE' });
    },

    // -------------------------------------------------------------
    // BMI Endpoints
    // -------------------------------------------------------------
    logBmi: async function (bmiData) {
      return await this.request('/api/bmi/log', {
        method: 'POST',
        body: JSON.stringify(bmiData)
      });
    },

    getBmiHistory: async function () {
      return await this.request('/api/bmi/history', { method: 'GET' });
    },

    // -------------------------------------------------------------
    // Dashboard Stats Endpoint
    // -------------------------------------------------------------
    getDashboardStats: async function () {
      return await this.request('/api/dashboard/stats', { method: 'GET' });
    },

    // -------------------------------------------------------------
    // Exercises Catalogue Endpoints
    // -------------------------------------------------------------
    getExercises: async function (params = {}) {
      const query = new URLSearchParams(params).toString();
      const endpoint = query ? `/api/exercises?${query}` : '/api/exercises';
      return await this.request(endpoint, { method: 'GET' });
    },

    getExerciseById: async function (id) {
      return await this.request(`/api/exercises/${encodeURIComponent(id)}`, { method: 'GET' });
    }
  };

  // Export globally
  window.FitBuddyApi = FitBuddyApi;
})(typeof window !== 'undefined' ? window : this);
