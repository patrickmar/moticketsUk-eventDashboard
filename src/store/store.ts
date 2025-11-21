import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { apiSlice } from "./api/apiSlice";
import counterReducer from "./slices/counterSlice";
import authReducer from "./api/authSlice";
import { eventsApi } from "./api/eventsApi";
import { authApi } from "./api/authApi";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"], // persist only token
};

const persistedAuth = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: persistedAuth,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    })
      .concat(eventsApi.middleware)
      .concat(authApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
