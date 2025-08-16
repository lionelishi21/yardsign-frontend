import { apiSlice } from '../slices/apiSlice';
import type { Menu } from '../../types';

// Extend the base API slice with menu-specific endpoints
export const menusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all menus for a restaurant
    getMenus: builder.query<Menu[], string>({
      query: (restaurantId) => `/menus/restaurants/${restaurantId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Menu' as const, id })),
              { type: 'Menu', id: 'LIST' },
            ]
          : [{ type: 'Menu', id: 'LIST' }],
    }),

    // Get single menu
    getMenu: builder.query<Menu, string>({
      query: (menuId) => `/menus/${menuId}`,
      providesTags: (result, error, id) => [{ type: 'Menu', id }],
    }),

    // Create new menu
    createMenu: builder.mutation<Menu, { restaurantId: string; data: { name: string; description?: string } }>({
      query: ({ restaurantId, data }) => ({
        url: `/menus/restaurants/${restaurantId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Menu', id: 'LIST' }],
    }),

    // Update menu
    updateMenu: builder.mutation<Menu, { menuId: string; data: { name?: string; description?: string } }>({
      query: ({ menuId, data }) => ({
        url: `/menus/${menuId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { menuId }) => [
        { type: 'Menu', id: menuId },
        { type: 'Menu', id: 'LIST' },
      ],
    }),

    // Delete menu
    deleteMenu: builder.mutation<{ success: boolean }, string>({
      query: (menuId) => ({
        url: `/menus/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Menu', id: 'LIST' }],
    }),

    // Add item to menu
    addItemToMenu: builder.mutation<Menu, { menuId: string; itemId: string }>({
      query: ({ menuId, itemId }) => ({
        url: `/menus/${menuId}/items`,
        method: 'POST',
        body: { itemId },
      }),
      invalidatesTags: (result, error, { menuId }) => [
        { type: 'Menu', id: menuId },
        { type: 'Menu', id: 'LIST' },
      ],
    }),

    // Remove item from menu
    removeItemFromMenu: builder.mutation<Menu, { menuId: string; itemId: string }>({
      query: ({ menuId, itemId }) => ({
        url: `/menus/${menuId}/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { menuId }) => [
        { type: 'Menu', id: menuId },
        { type: 'Menu', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetMenusQuery,
  useGetMenuQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useAddItemToMenuMutation,
  useRemoveItemFromMenuMutation,
} = menusApi; 