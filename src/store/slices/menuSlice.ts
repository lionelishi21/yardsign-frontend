import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { menuAPI } from '../../services/api';
import type { Menu } from '../../types';

interface MenuState {
  menus: Menu[];
  selectedMenu: Menu | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menus: [],
  selectedMenu: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchMenus = createAsyncThunk(
  'menus/fetchMenus',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const menus = await menuAPI.getMenus(restaurantId);
      return menus;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to fetch menus';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createMenu = createAsyncThunk(
  'menus/createMenu',
  async ({ restaurantId, data }: { restaurantId: string; data: { name: string; description?: string } }, { rejectWithValue }) => {
    try {
      const menu = await menuAPI.createMenu(restaurantId, data);
      return menu;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to create menu';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateMenu = createAsyncThunk(
  'menus/updateMenu',
  async ({ menuId, data }: { menuId: string; data: { name?: string; description?: string } }, { rejectWithValue }) => {
    try {
      const menu = await menuAPI.updateMenu(menuId, data);
      return menu;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to update menu';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteMenu = createAsyncThunk(
  'menus/deleteMenu',
  async (menuId: string, { rejectWithValue }) => {
    try {
      await menuAPI.deleteMenu(menuId);
      return menuId;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to delete menu';
      return rejectWithValue(errorMessage);
    }
  }
);

const menuSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    selectMenu: (state, action: PayloadAction<Menu | null>) => {
      state.selectedMenu = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateMenuLocal: (state, action: PayloadAction<Menu>) => {
      const index = state.menus.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.menus[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch menus
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create menu
      .addCase(createMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menus.push(action.payload);
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update menu
      .addCase(updateMenu.fulfilled, (state, action) => {
        const index = state.menus.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.menus[index] = action.payload;
        }
      })
      // Delete menu
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.menus = state.menus.filter(m => m.id !== action.payload);
      });
  },
});

export const { selectMenu, clearError, updateMenuLocal } = menuSlice.actions;
export default menuSlice.reducer; 