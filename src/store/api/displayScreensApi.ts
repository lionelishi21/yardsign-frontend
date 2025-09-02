import { apiSlice } from '../slices/apiSlice';
import type { Display } from '../../types';

// Extend the base API slice with display-specific endpoints
export const displayScreensApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all display screens for a restaurant
    getDisplayScreens: builder.query<Display[], string | void>({
      query: (restaurantId) => restaurantId 
        ? `/displays/restaurants/${restaurantId}`
        : '/displays',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Display' as const, id })),
              { type: 'Display', id: 'LIST' },
            ]
          : [{ type: 'Display', id: 'LIST' }],
    }),

    // Get single display screen
    getDisplayScreen: builder.query<Display, string>({
      query: (displayId) => `/displays/${displayId}`,
      providesTags: (result, error, id) => [{ type: 'Display', id }],
    }),

    // Create new display screen
    createDisplayScreen: builder.mutation<Display, { restaurantId: string; data: { name: string; currentMenu?: string } }>({
      query: ({ restaurantId, data }) => ({
        url: `/displays/restaurants/${restaurantId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Display', id: 'LIST' }],
    }),

    // Update display screen
    updateDisplayScreen: builder.mutation<Display, { displayId: string; data: { name?: string; currentMenu?: string } }>({
      query: ({ displayId, data }) => ({
        url: `/displays/${displayId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { displayId }) => [
        { type: 'Display', id: displayId },
        { type: 'Display', id: 'LIST' },
      ],
    }),

    // Assign menu to display
    assignMenuToDisplay: builder.mutation<Display, { displayId: string; menuId: string }>({
      query: ({ displayId, menuId }) => ({
        url: `/displays/${displayId}/assign-menu`,
        method: 'PATCH',
        body: { menuId },
      }),
      invalidatesTags: (result, error, { displayId }) => [
        { type: 'Display', id: displayId },
        { type: 'Display', id: 'LIST' },
      ],
    }),

    // Regenerate pairing code
    regeneratePairingCode: builder.mutation<{ pairingCode: string }, string>({
      query: (displayId) => ({
        url: `/displays/${displayId}/regenerate-pairing-code`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, displayId) => [
        { type: 'Display', id: displayId },
      ],
    }),

    // Pair display with code
    pairDisplay: builder.mutation<{ displayId: string; displayName: string }, string>({
      query: (pairingCode) => ({
        url: '/displays/pair',
        method: 'POST',
        body: { pairingCode },
      }),
    }),

    // Get display by pairing code
    getDisplayByPairingCode: builder.query<Display, string>({
      query: (pairingCode) => `/displays/pair/${pairingCode}`,
      providesTags: (result, error, pairingCode) => [
        { type: 'Display', id: result?.id || pairingCode },
      ],
    }),

    // Upload media to display
    uploadDisplayMedia: builder.mutation<Display, { displayId: string; file: File }>({
      query: ({ displayId, file }) => {
        const formData = new FormData();
        formData.append('media', file);
        
        return {
          url: `/displays/${displayId}/upload-media`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { displayId }) => [
        { type: 'Display', id: displayId },
      ],
    }),

    // Remove media from display
    removeDisplayMedia: builder.mutation<Display, string>({
      query: (displayId) => ({
        url: `/displays/${displayId}/media`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, displayId) => [
        { type: 'Display', id: displayId },
      ],
    }),

    // Delete display screen
    deleteDisplayScreen: builder.mutation<{ success: boolean }, string>({
      query: (displayId) => ({
        url: `/displays/${displayId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Display', id: 'LIST' }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetDisplayScreensQuery,
  useGetDisplayScreenQuery,
  useCreateDisplayScreenMutation,
  useUpdateDisplayScreenMutation,
  useAssignMenuToDisplayMutation,
  useRegeneratePairingCodeMutation,
  usePairDisplayMutation,
  useGetDisplayByPairingCodeQuery,
  useUploadDisplayMediaMutation,
  useRemoveDisplayMediaMutation,
  useDeleteDisplayScreenMutation,
} = displayScreensApi;