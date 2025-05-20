import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

console.log(
  "************* process.env.BACKEND_URL *********>>>>> ",
  Constants.default?.expoConfig?.extra?.BACKEND_URL
);
const baseUrl = Constants.default?.expoConfig?.extra?.BACKEND_URL;

export const baseApiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Profile"],
  baseQuery: async (args, api, extraOptions) => {
    // Handle token logic in the baseQuery function
    const { url, method, body, requiresAuth = false } = args;
    const headers: HeadersInit = {};
    if (requiresAuth) {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return fetchBaseQuery({
      baseUrl: baseUrl,
    })({ url, method, body, headers }, api, extraOptions);
  },
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { identifier: string; password: string }) => ({
        url: "login/",
        method: "POST",
        body: credentials,
        requiresAuth: false,
      }),
    }),
    signUp: builder.mutation({
      query: (userData: {
        first_name: string;
        last_name: string;
        email: string;
        username: string;
        password: string;
      }) => ({
        url: "signup/",
        method: "POST",
        body: JSON.parse(JSON.stringify(userData)),
        requiresAuth: false,
      }),
    }),
    socialLogin: builder.mutation({
      query: (credential: { id_token: string }) => ({
        url: "accounts/google/callback/",
        method: "POST",
        body: credential,
        requiresAuth: false,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (credential: { user_id: number; otp: string }) => ({
        url: "verify-otp/",
        method: "POST",
        body: credential,
        requiresAuth: false,
      }),
    }),
    resendOTP: builder.mutation({
      query: (credential: { user_id: number }) => ({
        url: "resend-otp/",
        method: "POST",
        body: credential,
        requiresAuth: false,
      }),
    }),
    createProject: builder.mutation({
      query: (credential: { user_id: number }) => ({
        url: "create-project/",
        method: "POST",
        body: JSON.parse(JSON.stringify(credential)),
        requiresAuth: true,
      }),
    }),
    chatAi: builder.mutation({
      query: (data: {
        user_id: number;
        category: string;
        message: string;
        image: string;
        follow_up: boolean;
        project_id: number;
        target_language?: string;
        pdf_file?: string;
        pdf_base64?: string;
        regenerate?: boolean;
      }) => {
        const formData = new FormData();
        formData.append("user_id", data.user_id.toString());
        formData.append("category", data.category);
        formData.append("message", data.message);
        formData.append("image", data.image);
        formData.append("follow_up", data.follow_up.toString());
        if (data.regenerate) {
          formData.append("regenerate", data.regenerate.toString());
        }
        formData.append("project_id", data.project_id.toString());
        if (data.target_language) {
          formData.append("target_language", data.target_language);
        }
        if (data.pdf_file) {
          formData.append("pdf_file", data.pdf_file);
        }
        if (data.pdf_base64) {
          formData.append("pdf_base64", data.pdf_base64);
        }
        // console.log("------>",formData);
        return {
          url: "assistant-task/",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          requiresAuth: true,
        };
      },
    }),
    SpeechToText: builder.mutation({
      query: (credential: { user_id: number; audio_bytes: string }) => ({
        url: "speech-to-text/",
        method: "POST",
        body: JSON.parse(JSON.stringify(credential)),
        requiresAuth: true,
      }),
    }),
    GetUserSettings: builder.mutation({
      query: (credential: { user_id: number }) => ({
        url: `get-user-settings/`,
        method: "POST",
        body: JSON.parse(JSON.stringify(credential)),
        requiresAuth: true,
      }),
    }),
    SetUserSettings: builder.mutation({
      query: (credential: {
        user_id: number;
        [key: string]: number | string;
      }) => ({
        url: `update-user-settings/`,
        method: "POST",
        body: JSON.parse(JSON.stringify(credential)),
        requiresAuth: true,
      }),
    }),
    toolsChatAi: builder.mutation({
      query: (data: {
        user_id: number;
        category: string;
        message: string;
        image: string;
        project_id: number;
        pdf_file: string;
      }) => {
        const formData = new FormData();
        formData.append("user_id", data.user_id.toString());
        formData.append("category", data.category);
        formData.append("message", data.message);
        formData.append("image", data.image);
        formData.append("project_id", data.project_id.toString());
        if (data.pdf_file) {
          formData.append("pdf_file", data.pdf_file);
        }
        return {
          url: "https://progressai.org/api/tools/",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          requiresAuth: true,
        };
      },
    }),
    TranslateChatAi: builder.mutation({
      query: (data: {
        user_id: number;
        category: string;
        message: string;
        image: string;
        project_id: number;
        target_language?: string;
      }) => {
        const formData = new FormData();
        formData.append("user_id", data.user_id.toString());
        formData.append("category", data.category);
        formData.append("message", data.message);
        if (data.image !== "") {
          formData.append("image", data?.image);
        }
        formData.append("project_id", data.project_id.toString());
        if (data.target_language) {
          formData.append("target_language", data.target_language);
        }
        return {
          url: `https://progressai.org/api/translator/`,
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          requiresAuth: true,
        };
      },
    }),
    textToSpeech: builder.mutation({
      query: (credential: { text: string }) => ({
        url: `text-to-speech/`,
        method: "POST",
        body: JSON.parse(JSON.stringify(credential)),
        requiresAuth: true,
      }),
    }),
    history: builder.mutation({
      query: (credential: { user_id: number }) => ({
        url: `get-chats/`,
        method: "POST",
        body: JSON.parse(JSON.stringify(credential)),
        requiresAuth: true,
      }),
    }),
    deleteHistory: builder.mutation({
      query: (credential: { chat_id: number }) => ({
        url: `delete-chat/`,
        method: "POST",
        body: JSON.parse(JSON.stringify(credential)),
        requiresAuth: true,
      }),
    }),
    uploadProfile: builder.mutation({
      query: (credential: {
        profile_picture: { type?: string; name?: string; uri?: string };
      }) => {
        const formData = new FormData();
        formData.append("profile_picture", {
          uri: credential.profile_picture.uri,
          name: credential.profile_picture.name,
          type: credential.profile_picture.type,
        } as any);
        return {
          url: "upload-profile-picture/",
          method: "POST",
          body: formData,
          requiresAuth: true,
        };
      },
      // Invalidate the 'Profile' tag so that getProfile will refetch
      invalidatesTags: ["Profile"],
    }),

    getProfile: builder.query({
      query: () => ({
        url: "get-profile-picture/",
        method: "GET",
        requiresAuth: true,
      }),
      // Provide a tag so that it can be invalidated
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useSocialLoginMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useCreateProjectMutation,
  useChatAiMutation,
  useSpeechToTextMutation,
  useGetUserSettingsMutation,
  useSetUserSettingsMutation,
  useToolsChatAiMutation,
  useTranslateChatAiMutation,
  useTextToSpeechMutation,
  useHistoryMutation,
  useDeleteHistoryMutation,
  useUploadProfileMutation,
  useGetProfileQuery,
} = baseApiSlice;

export default baseApiSlice;
