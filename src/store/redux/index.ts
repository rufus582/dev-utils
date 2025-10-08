import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { type AppStateType } from "./root-reducer";

const store = configureStore({
  reducer: rootReducer,
});

export { type AppStateType };
export type AppDispatch = typeof store.dispatch;

export default store;
