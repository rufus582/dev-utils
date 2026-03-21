import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

export const jqDataStateSchema = z.object({
  filter: z.string(),
  result: z.string(),
  jsonStr: z.string(),
});

type JQDataStateType = z.output<typeof jqDataStateSchema>;

const initialState: JQDataStateType = {
  filter: ".",
  result: "",
  jsonStr: "",
};

const jqSlice = createSlice({
  name: "jq",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    setJsonStr: (state, action: PayloadAction<string>) => {
      state.jsonStr = action.payload;
    },
    setResult: (state, action: PayloadAction<string>) => {
      state.result = action.payload;
    },
  },
});

export const JQActions = jqSlice.actions;
const jqReducer = jqSlice.reducer;
export default jqReducer;
