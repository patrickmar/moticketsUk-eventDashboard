import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import counterReducer from "./slices/counterSlice";
import authReducer from "./api/authSlice";
import { eventsApi } from "./api/eventsApi";
import { authApi } from "./api/authApi";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer, // Add auth reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(eventsApi.middleware)
      .concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
