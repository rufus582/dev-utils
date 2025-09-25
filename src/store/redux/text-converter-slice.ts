import { TextFormats, type TextFormatType } from "@/lib/text-formats";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TextConverterStateType {
  fromFormat: TextFormatType;
  toConvert: string;
  toFormat: TextFormatType;
  converted: string;
}

const initialState: TextConverterStateType = {
  fromFormat: TextFormats.Base64,
  toConvert: "",
  toFormat: TextFormats.JSON,
  converted: "",
};

const textConverterSlice = createSlice({
  name: "textConverter",
  initialState,
  reducers: {
    setFromFormat: (state, action: PayloadAction<TextFormatType>) => {
      state.fromFormat = action.payload;
    },
    setToFormat: (state, action: PayloadAction<TextFormatType>) => {
      state.toFormat = action.payload;
    },
    setTextToConvert: (state, action: PayloadAction<string>) => {
      state.toConvert = action.payload;
    },
    setConvertedText: (state, action: PayloadAction<string>) => {
      state.converted = action.payload;
    },
    setConvertDataState: (_, action: PayloadAction<TextConverterStateType>) =>
      action.payload,
  },
});

export const TextConverterActions = textConverterSlice.actions;
const textConverterReducer = textConverterSlice.reducer;
export default textConverterReducer;
