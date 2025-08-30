import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";

import authReducer from "@/features/auth/authSlice";
import notificationReducer from "@/features/notification/notificationSlice";
const authConfig = {
  key: "auth",
  storage,
};

const notificationConfig = {
  key: "notifications",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  notifications: persistReducer(notificationConfig, notificationReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export const persistor = persistStore(store);
