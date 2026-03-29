import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";

const jmesPathDataStateSchemaInit = z.object({
  expression: z.string(),
  result: z.string(),
  jsonStr: z.string(),
});

type JMESPathDataStateType = z.output<typeof jmesPathDataStateSchemaInit>;

const initialState: JMESPathDataStateType = {
  expression: "",
  result: "",
  jsonStr: "",
};

export const jmesPathDataStateSchema =
  jmesPathDataStateSchemaInit.default(initialState);

const jmesPathSlice = createSlice({
  name: "jmespath",
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

export const JMESPathActions = jmesPathSlice.actions;
const jmesPathReducer = jmesPathSlice.reducer;
export default jmesPathReducer;
