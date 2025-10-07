import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TextConverterStateType {
  fromFormatName: string;
  toConvert: string;
  toFormatName: string;
  converted: string;
}

const initialState: TextConverterStateType = {
  fromFormatName: "Base64",
  toConvert: "",
  toFormatName: "JSON",
  converted: "",
};

const textConverterSlice = createSlice({
  name: "textConverter",
  initialState,
  reducers: {
    setFromFormat: (state, action: PayloadAction<string>) => {
      state.fromFormatName = action.payload;
    },
    setToFormat: (state, action: PayloadAction<string>) => {
      state.toFormatName = action.payload;
    },
    setTextToConvert: (state, action: PayloadAction<string>) => {
      state.toConvert = action.payload;
    },
    setConvertedText: (state, action: PayloadAction<string>) => {
      state.converted = action.payload;
    },
    setState: (_, action: PayloadAction<TextConverterStateType>) =>
      action.payload,
  },
});

export const TextConverterActions = textConverterSlice.actions;
const textConverterReducer = textConverterSlice.reducer;
export default textConverterReducer;
