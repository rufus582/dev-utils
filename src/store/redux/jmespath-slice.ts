import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type JMESPathDataStateType = {
  expression: string;
  result: string;
  jsonStr: string;
};

const initialState: JMESPathDataStateType = {
  expression: "",
  result: "",
  jsonStr: "",
};

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
