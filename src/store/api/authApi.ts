import { apiSlice } from '../slices/apiSlice';
import type { User, AuthResponse } from '../../types';

// Extend the base API slice with auth-specific endpoints
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login user
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password },
      }),
      invalidatesTags: ['User'],
    }),

    // Register user
    register: builder.mutation<AuthResponse, { email: string; password: string; restaurantName: string }>({
      query: ({ email, password, restaurantName }) => ({
        url: '/auth/register',
        method: 'POST',
        body: { email, password, restaurantName },
      }),
      invalidatesTags: ['User'],
    }),

    // Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Refresh token
    refreshToken: builder.mutation<{ token: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),

    // Logout user
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Update user profile
    updateProfile: builder.mutation<User, { name?: string; email?: string }>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Change password
    changePassword: builder.mutation<{ success: boolean }, { currentPassword: string; newPassword: string }>({
      query: ({ currentPassword, newPassword }) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: { currentPassword, newPassword },
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation<{ success: boolean }, { email: string }>({
      query: ({ email }) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<{ success: boolean }, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, password },
      }),
    }),

    // Verify email
    verifyEmail: builder.mutation<{ success: boolean }, { token: string }>({
      query: ({ token }) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
} = authApi; 