import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import displaySlice from './slices/displaySlice';
import menuSlice from './slices/menuSlice';
import itemSlice from './slices/itemSlice';
import { apiSlice } from './slices/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    displays: displaySlice,
    menus: menuSlice,
    items: itemSlice,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 