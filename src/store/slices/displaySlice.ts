import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { displayAPI } from '../../services/api';
import type { Display } from '../../types';

interface DisplayState {
  displays: Display[];
  selectedDisplay: Display | null;
  loading: boolean;
  error: string | null;
}

const initialState: DisplayState = {
  displays: [],
  selectedDisplay: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchDisplays = createAsyncThunk(
  'displays/fetchDisplays',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const displays = await displayAPI.getDisplays(restaurantId);
      return displays;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to fetch displays';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createDisplay = createAsyncThunk(
  'displays/createDisplay',
  async ({ restaurantId, data }: { restaurantId: string; data: { name: string } }, { rejectWithValue }) => {
    try {
      const display = await displayAPI.createDisplay(restaurantId, data);
      return display;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to create display';
      return rejectWithValue(errorMessage);
    }
  }
);

export const assignMenuToDisplay = createAsyncThunk(
  'displays/assignMenu',
  async ({ displayId, menuId }: { displayId: string; menuId: string }, { rejectWithValue }) => {
    try {
      const display = await displayAPI.assignMenu(displayId, menuId);
      return display;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to assign menu';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteDisplay = createAsyncThunk(
  'displays/deleteDisplay',
  async (displayId: string, { rejectWithValue }) => {
    try {
      await displayAPI.deleteDisplay(displayId);
      return displayId;
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to delete display';
      return rejectWithValue(errorMessage);
    }
  }
);

const displaySlice = createSlice({
  name: 'displays',
  initialState,
  reducers: {
    selectDisplay: (state, action: PayloadAction<Display | null>) => {
      state.selectedDisplay = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateDisplay: (state, action: PayloadAction<Display>) => {
      const index = state.displays.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.displays[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch displays
      .addCase(fetchDisplays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisplays.fulfilled, (state, action) => {
        state.loading = false;
        state.displays = action.payload;
      })
      .addCase(fetchDisplays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create display
      .addCase(createDisplay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDisplay.fulfilled, (state, action) => {
        state.loading = false;
        state.displays.push(action.payload);
      })
      .addCase(createDisplay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Assign menu
      .addCase(assignMenuToDisplay.fulfilled, (state, action) => {
        const index = state.displays.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.displays[index] = action.payload;
        }
      })
      // Delete display
      .addCase(deleteDisplay.fulfilled, (state, action) => {
        state.displays = state.displays.filter(d => d.id !== action.payload);
      });
  },
});

export const { selectDisplay, clearError, updateDisplay } = displaySlice.actions;
export default displaySlice.reducer; 