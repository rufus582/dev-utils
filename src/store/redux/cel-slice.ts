import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CELDataStateType = {
  expression: string;
  result: string;
  jsonStr: string;
};

const initialState: CELDataStateType = {
  expression: "",
  result: "",
  jsonStr: "",
};

const celSlice = createSlice({
  name: "cel",
  initialState,
  reducers: {
    setCELExpression: (state, action: PayloadAction<string>) => {
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

export const CELActions = celSlice.actions;
const celReducer = celSlice.reducer;
export default celReducer;
