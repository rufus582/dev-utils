import { configureStore } from "@reduxjs/toolkit";
import jqReducer from "./jq-slice";
import jmesPathReducer from "./jmespath-slice";
import textConverterReducer from "./text-converter-slice";
import jsonTableViewerReducer from "./json-table-viewer-slice";
import celReducer from "./cel-slice";

const store = configureStore({
  reducer: {
    jq: jqReducer,
    jmespath: jmesPathReducer,
    textConverter: textConverterReducer,
    jsonTableViewer: jsonTableViewerReducer,
    cel: celReducer,
  },
});

export type AppStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
