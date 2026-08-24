// Centralized API Service for QuickBite Food Ordering System
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Helper for making HTTP requests with automatic Bearer token injection
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('quickbite_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({
      success: false,
      message: `Failed to parse response (Status: ${res.status})`,
    }));

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication
  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser: async () => {
    return request('/auth/me');
  },

  // Restaurants
  getRestaurants: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.cuisine) searchParams.append('cuisine', params.cuisine);

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request(`/restaurants${queryStr}`);
  },

  getRestaurantById: async (id) => {
    return request(`/restaurants/${id}`);
  },

  // Orders
  createOrder: async (orderData) => {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getOrders: async () => {
    return request('/orders');
  },

  getOrderById: async (id) => {
    return request(`/orders/${id}`);
  },

  updateOrderStatus: async (id, status) => {
    return request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

export default api;
