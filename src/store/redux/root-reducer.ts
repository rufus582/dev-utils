import { type PayloadAction, combineReducers } from "@reduxjs/toolkit";
import jqReducer from "./jq-slice";
import jmesPathReducer from "./jmespath-slice";
import textConverterReducer from "./text-converter-slice";
import jsonTableViewerReducer from "./json-table-viewer-slice";
import celReducer from "./cel-slice";
import jsonpathReducer from "./jsonpath-slice";

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

const rootReducer = (
  state: AppStateType | undefined,
  action: PayloadAction<AppStateType>
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
