import { useDispatch, useSelector } from "react-redux";
import type { AppStateType, AppDispatch } from "../store/redux";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppStateType>();
