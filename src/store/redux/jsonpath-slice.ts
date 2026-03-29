import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

const jsonPathDataStateSchemaInit = z.object({
  expression: z.string(),
  result: z.string(),
  jsonStr: z.string(),
});

type JSONPathDataStateType = z.output<typeof jsonPathDataStateSchemaInit>;

const initialState: JSONPathDataStateType = {
  expression: "$",
  result: "",
  jsonStr: "",
};

export const jsonPathDataStateSchema =
  jsonPathDataStateSchemaInit.default(initialState);

const jsonpathSlice = createSlice({
  name: "jsonpath",
  initialState,
  reducers: {
    setExpression: (state, action: PayloadAction<string>) => {
      state.expression = action.payload;
    },
    setJsonStr: (state, action: PayloadAction<string>) => {
      state.jsonStr = action.payload;
    },
    setResult: (state, action: PayloadAction<string>) => {
      state.result = action.payload;
    },
  },
});

export const JSONPathActions = jsonpathSlice.actions;
const jsonpathReducer = jsonpathSlice.reducer;
export default jsonpathReducer;
