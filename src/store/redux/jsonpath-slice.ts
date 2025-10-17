import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type JSONPathDataStateType = {
  expression: string;
  result: string;
  jsonStr: string;
};

const initialState: JSONPathDataStateType = {
  expression: "$",
  result: "",
  jsonStr: "",
};

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
