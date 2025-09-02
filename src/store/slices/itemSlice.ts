import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { itemAPI } from '../../services/api';
import type { Item } from '../../types';

interface ItemState {
  items: Item[];
  selectedItem: Item | null;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const items = await itemAPI.getItems(restaurantId);
      return items;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to fetch items';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createItem = createAsyncThunk(
  'items/createItem',
  async ({ restaurantId, data }: { 
    restaurantId: string; 
    data: {
      name: string;
      description?: string;
      price: number;
      category: string;
      imageUrl?: string;
      isAvailable?: boolean;
    }
  }, { rejectWithValue }) => {
    try {
      const item = await itemAPI.createItem(restaurantId, data);
      return item;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to create item';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ itemId, data }: { 
    itemId: string; 
    data: {
      name?: string;
      description?: string;
      price?: number;
      category?: string;
      imageUrl?: string;
      isAvailable?: boolean;
    }
  }, { rejectWithValue }) => {
    try {
      const item = await itemAPI.updateItem(itemId, data);
      return item;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to update item';
      return rejectWithValue(errorMessage);
    }
  }
);

export const toggleItemAvailability = createAsyncThunk(
  'items/toggleAvailability',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const item = await itemAPI.toggleItemAvailability(itemId);
      return item;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to toggle item availability';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await itemAPI.deleteItem(itemId);
      return itemId;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to delete item';
      return rejectWithValue(errorMessage);
    }
  }
);

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<Item | null>) => {
      state.selectedItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateItemLocal: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create item
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update item
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Toggle availability
      .addCase(toggleItemAvailability.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete item
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  },
});

export const { selectItem, clearError, updateItemLocal } = itemSlice.actions;
export default itemSlice.reducer; 