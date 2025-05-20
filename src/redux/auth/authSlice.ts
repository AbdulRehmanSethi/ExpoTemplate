import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseApiSlice } from "../apiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  userId: number | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  access_token: string | null;
  email: string | null;
  name: string | null;
}

const initialState: AuthState = {
  userId: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
  access_token: null,
  email: null,
  name: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userId = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      state.access_token = null;
      AsyncStorage.removeItem("access_token");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(baseApiSlice.endpoints.login.matchPending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        baseApiSlice.endpoints.login.matchFulfilled,
        (state, action: PayloadAction<{ user_id: number }>) => {
          state.userId = action.payload.user_id;
          state.isAuthenticated = true;
          state.status = "success";
          AsyncStorage.setItem("user_id", action.payload.user_id.toString());
        }
      )
      .addMatcher(
        baseApiSlice.endpoints.login.matchRejected,
        (state, action) => {
          state.status = "error";
          state.error = action.error?.message || "Login failed";
        }
      )
      .addMatcher(
        baseApiSlice.endpoints.verifyOTP.matchFulfilled,
        (
          state,
          action: PayloadAction<{
            user_id: number;
            access_token: string;
            email: string;
            name: string;
          }>
        ) => {
          const { user_id, access_token, email, name } = action.payload;
          state.userId = user_id;
          state.isAuthenticated = true;
          state.status = "success";
          state.access_token = access_token;
          state.email = email;
          state.name = name;
          AsyncStorage.setItem("user_id", user_id.toString());
          AsyncStorage.setItem("access_token", access_token);
        }
      )
      .addMatcher(
        baseApiSlice.endpoints.verifyOTP.matchRejected,
        (state, action) => {
          state.status = "error";
          state.error = action.error?.message || "Verification failed";
        }
      )
      .addMatcher(
        baseApiSlice.endpoints.socialLogin.matchFulfilled,
        (
          state,
          action: PayloadAction<{
            user_id: number;
            access_token: string;
            email: string;
            name: string;
          }>
        ) => {
          const { user_id, access_token, email, name } = action.payload;
          state.userId = user_id;
          state.isAuthenticated = true;
          state.status = "success";
          state.access_token = access_token;
          state.email = email;
          state.name = name;
          AsyncStorage.setItem("user_id", user_id.toString());
          AsyncStorage.setItem("access_token", access_token);
          AsyncStorage.setItem("email", email);
          AsyncStorage.setItem("name", name);
        }
      )
      .addMatcher(
        baseApiSlice.endpoints.socialLogin.matchRejected,
        (state, action) => {
          state.status = "error";
          state.error = action.error?.message || "Social login failed";
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
