import { type PayloadAction, combineReducers } from "@reduxjs/toolkit";
import jqReducer, { jqDataStateSchema } from "./jq-slice";
import jmesPathReducer, { jmesPathDataStateSchema } from "./jmespath-slice";
import textConverterReducer, {
  textConverterStateSchema,
} from "./text-converter-slice";
import jsonTableViewerReducer, {
  jsonTableViewerStateSchema,
} from "./json-table-viewer-slice";
import celReducer, { celDataStateSchema } from "./cel-slice";
import jsonpathReducer, { jsonPathDataStateSchema } from "./jsonpath-slice";
import z from "zod";

const RESET_STATE = "root/resetState";

const appReducer = combineReducers({
  jq: jqReducer,
  jmespath: jmesPathReducer,
  textConverter: textConverterReducer,
  jsonTableViewer: jsonTableViewerReducer,
  cel: celReducer,
  jsonpath: jsonpathReducer,
});

export type AppStateType = ReturnType<typeof appReducer>;

export const appStateSchema: z.ZodType<AppStateType> = z.object({
  jq: jqDataStateSchema,
  jmespath: jmesPathDataStateSchema,
  textConverter: textConverterStateSchema,
  jsonTableViewer: jsonTableViewerStateSchema,
  cel: celDataStateSchema,
  jsonpath: jsonPathDataStateSchema,
});

const rootReducer = (
  state: AppStateType | undefined,
  action: PayloadAction<AppStateType>,
): AppStateType => {
  if (action.type === RESET_STATE) {
    return action.payload;
  }

  return appReducer(state, action);
};

export const RootActions = {
  setAppState: (newState: AppStateType) => ({
    type: RESET_STATE,
    payload: newState,
  }),
};
export default rootReducer;
