import { createSlice } from "@reduxjs/toolkit";

interface chatState {
  imageBase64: string;
  imageURL: string;
  scanValue: string;
  micUI: boolean;
  speechToText: string;
  liveCallUI: boolean;
  reTake: boolean;
  toolName: string;
  targetLanguage: string;
  fileName: string;
  isTyping: boolean;
  toolID: string;
}

const initialState = {
  imageBase64: null,
  imageURI: null,
  scanValue: "maths",
  micUI: false,
  speechToText: "",
  liveCallUI: false,
  reTake: false,
  toolName: "",
  targetLanguage: "",
  fileName: "",
  isTyping: false,
  toolID: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setScanValue: (state, action) => {
      state.scanValue = action.payload;
    },
    setImageBase64: (state, action) => {
      state.imageBase64 = action.payload;
    },
    setImageURI: (state, action) => {
      state.imageURI = action.payload;
    },
    setReTake: (state, action) => {
      state.reTake = action.payload;
    },
    setToolName: (state, action) => {
      state.toolName = action.payload;
    },
    setTargetLanguage: (state, action) => {
      state.targetLanguage = action.payload;
    },
    setFilelName: (state, action) => {
      state.fileName = action.payload;
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearFileName: (state) => {
      state.fileName = "";
    },
    clearDataImage: (state) => {
      state.imageBase64 = null;
      state.imageURI = null;
    },
    clearToolName: (state) => {
      state.toolName = "";
    },
    clearScanValue: (state) => {
      state.scanValue = "";
    },
    clearImage: (state) => {
      state.speechToText = "";
    },
    setMicUI: (state, action) => {
      state.micUI = action.payload;
    },
    setSpeechToText: (state, action) => {
      state.speechToText = action.payload;
    },
    setLiveCallUI: (state, action) => {
      state.liveCallUI = action.payload;
    },
    setToolID: (state, action) => {
      state.toolID = action.payload;
    },
    clearToolID: (state) => {
      state.toolID = "";
    },
  },
});

export const {
  setScanValue,
  setImageBase64,
  setImageURI,
  clearImage,
  setMicUI,
  setSpeechToText,
  setLiveCallUI,
  setReTake,
  clearDataImage,
  setToolName,
  setTargetLanguage,
  clearToolName,
  setFilelName,
  clearFileName,
  setIsTyping,
  setToolID,
  clearToolID,
} = chatSlice.actions;

export default chatSlice.reducer;
