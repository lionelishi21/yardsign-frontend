import { apiSlice } from '../slices/apiSlice';
import type { Item } from '../../types';

// Extend the base API slice with item-specific endpoints
export const itemsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all items for a restaurant
    getItems: builder.query<Item[], string>({
      query: (restaurantId) => `/items/restaurants/${restaurantId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Item' as const, id })),
              { type: 'Item', id: 'LIST' },
            ]
          : [{ type: 'Item', id: 'LIST' }],
    }),

    // Get single item
    getItem: builder.query<Item, string>({
      query: (itemId) => `/items/${itemId}`,
      providesTags: (result, error, id) => [{ type: 'Item', id }],
    }),

    // Create new item
    createItem: builder.mutation<Item, { 
      restaurantId: string; 
      data: {
        name: string;
        description?: string;
        price: number;
        category: string;
        imageUrl?: string;
        isAvailable?: boolean;
      }
    }>({
      query: ({ restaurantId, data }) => ({
        url: `/items/restaurants/${restaurantId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Item', id: 'LIST' }],
    }),

    // Update item
    updateItem: builder.mutation<Item, { 
      itemId: string; 
      data: {
        name?: string;
        description?: string;
        price?: number;
        category?: string;
        imageUrl?: string;
        isAvailable?: boolean;
      }
    }>({
      query: ({ itemId, data }) => ({
        url: `/items/${itemId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { itemId }) => [
        { type: 'Item', id: itemId },
        { type: 'Item', id: 'LIST' },
      ],
    }),

    // Toggle item availability
    toggleItemAvailability: builder.mutation<Item, string>({
      query: (itemId) => ({
        url: `/items/${itemId}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, itemId) => [
        { type: 'Item', id: itemId },
        { type: 'Item', id: 'LIST' },
      ],
    }),

    // Upload item image
    uploadItemImage: builder.mutation<Item, { itemId: string; file: File }>({
      queryFn: async ({ itemId, file }, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          // 1. Get presigned URL
          const presignedResult = await fetchWithBQ({
            url: `/items/${itemId}/upload-url?fileType=${encodeURIComponent(file.type)}`,
            method: 'GET',
          });

          if (presignedResult.error) return { error: presignedResult.error };

          const { uploadUrl, imageUrl } = presignedResult.data as { uploadUrl: string, imageUrl: string };

          // 2. Upload to S3 directly
          const s3Response = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            }
          });

          if (!s3Response.ok) {
            return { error: { status: s3Response.status, data: 'Failed to upload to S3' } as any };
          }

          // Return partial item, or the UI might rely on invalidatesTags
          return { data: { id: itemId, imageUrl } as unknown as Item };
        } catch (error) {
          return { error: { status: 500, data: String(error) } as any };
        }
      },
      invalidatesTags: (result, error, { itemId }) => [
        { type: 'Item', id: itemId },
      ],
    }),

    // Delete item
    deleteItem: builder.mutation<{ success: boolean }, string>({
      query: (itemId) => ({
        url: `/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Item', id: 'LIST' }],
    }),

    // Get items by category
    getItemsByCategory: builder.query<Item[], { restaurantId: string; category: string }>({
      query: ({ restaurantId, category }) => `/items/restaurants/${restaurantId}?category=${category}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Item' as const, id })),
              { type: 'Item', id: 'CATEGORY' },
            ]
          : [{ type: 'Item', id: 'CATEGORY' }],
    }),

    // Search items
    searchItems: builder.query<Item[], { restaurantId: string; query: string }>({
      query: ({ restaurantId, query }) => `/items/restaurants/${restaurantId}/search?q=${query}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Item' as const, id })),
              { type: 'Item', id: 'SEARCH' },
            ]
          : [{ type: 'Item', id: 'SEARCH' }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetItemsQuery,
  useGetItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useToggleItemAvailabilityMutation,
  useUploadItemImageMutation,
  useDeleteItemMutation,
  useGetItemsByCategoryQuery,
  useSearchItemsQuery,
} = itemsApi; 