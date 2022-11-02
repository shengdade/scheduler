import { configureStore } from '@reduxjs/toolkit';
import { schedulerApi } from './scheduler';

export const store = configureStore({
  reducer: {
    [schedulerApi.reducerPath]: schedulerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(schedulerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
