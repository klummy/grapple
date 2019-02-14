import { INotification, ITab } from '../../types/layout';
import {
  CLOSE_TAB, NEW_TAB, SWITCH_TAB, UPDATE_TAB,
  ADD_NOTIFICATION, REMOVE_NOTIFICATION,
} from './layout.types';

export const addTab = (payload: ITab) => ({
  payload,
  type: NEW_TAB,
});

export const closeTab = (payload?: ITab) => ({
  payload,
  type: CLOSE_TAB,
});

export const switchTab = (payload: ITab) => ({
  payload,
  type: SWITCH_TAB,
});

export const updateTab = (payload: ITab) => ({
  payload,
  type: UPDATE_TAB,
});

export const addNotification = (payload: INotification) => ({
  payload,
  type: ADD_NOTIFICATION,
});

export const removeNotification = (payload: INotification) => ({
  payload,
  type: REMOVE_NOTIFICATION,
});
