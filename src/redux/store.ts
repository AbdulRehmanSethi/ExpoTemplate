import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import themeReducer from "./theme/themeSlice";
import authReducer from "./auth/authSlice";
import chatReducer from "./chat/chatSlice";
import baseApiSlice from "./apiSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["theme", "auth"], // Only persist the 'theme' slice or slice you want to persist.
};

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  chat: chatReducer,
  [baseApiSlice.reducerPath]: baseApiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApiSlice.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
