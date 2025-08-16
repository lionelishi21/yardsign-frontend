import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// Define base URL - can be overridden with environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.yaadsign.com';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from state or localStorage
    const token = (getState() as RootState).auth.user ? localStorage.getItem('token') : null;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('content-type', 'application/json');
    return headers;
  },
  timeout: 30000, // 30 second timeout
});

// Base query with re-authentication
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await baseQuery(args as string | FetchArgs, api, extraOptions);
  
  // If we get a 401, clear auth and redirect to login
  if (result.error && 'status' in result.error && result.error.status === 401) {
    // Clear auth state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/login';
  }
  
  return result;
};

// Create the base API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  
  // Define tag types for cache invalidation
  tagTypes: [
    'User',
    'Restaurant', 
    'Display',
    'Menu',
    'Item',
    'DisplayScreen'
  ],
  
  // Base endpoints - can be extended by other slices
  endpoints: (builder) => ({
    // Health check endpoint
    healthCheck: builder.query<{ status: string; timestamp: string }, void>({
      query: () => '/health',
      providesTags: ['User'], // Arbitrary tag for basic caching
    }),
    
    // Get current user info
    getCurrentUser: builder.query<{ id: string; email: string; restaurant?: unknown }, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    
    // Upload file endpoint
    uploadFile: builder.mutation<{ url: string; filename: string }, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useHealthCheckQuery,
  useGetCurrentUserQuery,
  useUploadFileMutation,
} = apiSlice;

// Export the reducer to be included in store
export default apiSlice.reducer; 