import axios from 'axios';
import type { Restaurant, Menu, Item, Display, AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email: string, password: string, restaurantName: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { email, password, restaurantName });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Restaurant API
export const restaurantAPI = {
  getMyRestaurant: async (): Promise<Restaurant> => {
    const response = await api.get('/restaurants/my/restaurant');
    return response.data;
  },

  getRestaurant: async (restaurantId: string): Promise<Restaurant> => {
    const response = await api.get(`/restaurants/${restaurantId}`);
    return response.data;
  },

  updateRestaurant: async (restaurantId: string, name: string): Promise<Restaurant> => {
    const response = await api.put(`/restaurants/${restaurantId}`, { name });
    return response.data;
  },

  getStats: async (restaurantId: string) => {
    const response = await api.get(`/restaurants/${restaurantId}/stats`);
    return response.data;
  },
};

// Menu API
export const menuAPI = {
  createMenu: async (restaurantId: string, data: { name: string; description?: string; items?: string[] }): Promise<Menu> => {
    const response = await api.post(`/menus/restaurants/${restaurantId}`, data);
    return response.data;
  },

  getMenus: async (restaurantId: string): Promise<Menu[]> => {
    const response = await api.get(`/menus/restaurants/${restaurantId}`);
    return response.data;
  },

  getMenu: async (menuId: string): Promise<Menu> => {
    const response = await api.get(`/menus/${menuId}`);
    return response.data;
  },

  updateMenu: async (menuId: string, data: { name?: string; description?: string; items?: string[] }): Promise<Menu> => {
    const response = await api.put(`/menus/${menuId}`, data);
    return response.data;
  },

  deleteMenu: async (menuId: string): Promise<void> => {
    await api.delete(`/menus/${menuId}`);
  },
};

// Item API
export const itemAPI = {
  createItem: async (restaurantId: string, data: {
    name: string;
    description?: string;
    price: number;
    category: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }): Promise<Item> => {
    const response = await api.post(`/items/restaurants/${restaurantId}`, data);
    return response.data;
  },

  getItems: async (restaurantId: string): Promise<Item[]> => {
    const response = await api.get(`/items/restaurants/${restaurantId}`);
    return response.data;
  },

  updateItem: async (itemId: string, data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }): Promise<Item> => {
    const response = await api.put(`/items/${itemId}`, data);
    return response.data;
  },

  toggleItemAvailability: async (itemId: string): Promise<Item> => {
    const response = await api.patch(`/items/${itemId}/toggle`);
    return response.data;
  },

  deleteItem: async (itemId: string): Promise<void> => {
    await api.delete(`/items/${itemId}`);
  },
};

// Display API
export const displayAPI = {
  createDisplay: async (restaurantId: string, data: { name: string; currentMenu?: string }): Promise<Display> => {
    const response = await api.post(`/displays/restaurants/${restaurantId}`, data);
    return response.data;
  },

  getDisplays: async (restaurantId: string): Promise<Display[]> => {
    const response = await api.get(`/displays/restaurants/${restaurantId}`);
    return response.data;
  },

  getDisplay: async (displayId: string): Promise<Display> => {
    const response = await api.get(`/displays/${displayId}`);
    return response.data;
  },

  updateDisplay: async (displayId: string, data: { name?: string; currentMenu?: string }): Promise<Display> => {
    const response = await api.put(`/displays/${displayId}`, data);
    return response.data;
  },

  assignMenu: async (displayId: string, menuId: string): Promise<Display> => {
    console.log('API: assignMenu called with:', { displayId, menuId });
    const requestBody = { menuId };
    console.log('API: request body:', requestBody);
    const response = await api.patch(`/displays/${displayId}/assign-menu`, requestBody);
    console.log('API: response:', response.data);
    return response.data;
  },

  regeneratePairingCode: async (displayId: string): Promise<{ pairingCode: string }> => {
    const response = await api.patch(`/displays/${displayId}/regenerate-pairing-code`);
    return response.data;
  },

  pairDisplay: async (pairingCode: string): Promise<{ displayId: string; displayName: string }> => {
    const response = await api.post('/displays/pair', { pairingCode });
    return response.data;
  },

  getDisplayByPairingCode: async (pairingCode: string): Promise<Display> => {
    const response = await api.get(`/displays/pair/${pairingCode}`);
    return response.data;
  },

  uploadMedia: async (displayId: string, file: File): Promise<Display> => {
    const formData = new FormData();
    formData.append('media', file);
    
    const response = await api.post(`/displays/${displayId}/upload-media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeMedia: async (displayId: string): Promise<Display> => {
    const response = await api.delete(`/displays/${displayId}/media`);
    return response.data;
  },

  deleteDisplay: async (displayId: string): Promise<void> => {
    await api.delete(`/displays/${displayId}`);
  },
};

export default api; 