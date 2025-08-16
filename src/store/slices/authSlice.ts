import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import type { User, AuthResponse } from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response: AuthResponse = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'
        : 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, restaurantName }: { email: string; password: string; restaurantName: string }, { rejectWithValue }) => {
    try {
      const response: AuthResponse = await authAPI.register(email, password, restaurantName);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed'
        : 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const user: User = JSON.parse(userData);
        return { user, token };
      }
      
      return rejectWithValue('No stored authentication data');
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Invalid stored authentication data');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Initialize
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer; 