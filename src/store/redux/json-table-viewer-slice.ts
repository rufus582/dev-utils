import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import z from "zod";

export const jsonTableViewerStateSchema = z.object({
  jsonData: z.any(),
  jsonStr: z.string(),
  curl: z.string().optional()
})

type JSONTableViewerStateType = z.output<typeof jsonTableViewerStateSchema>

const initialState: JSONTableViewerStateType = {
  jsonData: {},
  jsonStr: "",
  curl: "",
};

const jsonTableViewerSlice = createSlice({
  name: "jsonTableViewer",
  initialState,
  reducers: {
    setJsonData: (state, action: PayloadAction<JSONObject>) => {
      state.jsonData = action.payload;
    },
    setJsonStr: (state, action: PayloadAction<string>) => {
      state.jsonStr = action.payload;
    },
    setCurl: (state, action: PayloadAction<string>) => {
      state.curl = action.payload;
    },
  },
});

export const JSONTableViewerActions = jsonTableViewerSlice.actions;
const jsonTableViewerReducer = jsonTableViewerSlice.reducer;
export default jsonTableViewerReducer;
