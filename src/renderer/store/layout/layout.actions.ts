import { ITab } from "../..//types/layout";
import { CLOSE_TAB, NEW_TAB, RENAME_TAB, SWITCH_TAB } from "./layout.types";

export const addTab = (payload: ITab) => ({
  payload,
  type: NEW_TAB
})

export const closeTab = (payload: ITab) => ({
  payload,
  type: CLOSE_TAB
})

export const switchTab = (payload: ITab) => ({
  payload,
  type: SWITCH_TAB
})

export const renameTab = (payload: ITab) => ({
  payload,
  type: RENAME_TAB
})
