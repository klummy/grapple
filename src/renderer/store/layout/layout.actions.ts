import { ITab } from "../..//types/layout";
import { CLOSE_TAB, NEW_TAB } from "./layout.types";

export const addTab = (payload: ITab) => ({
  payload,
  type: NEW_TAB
})

export const closeTab = (payload: ITab) => ({
  payload,
  type: CLOSE_TAB
})