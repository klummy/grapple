import Mousetrap from 'mousetrap';
import { Dispatch } from 'redux';

import logger from '../libs/logger';
import { closeTab, switchTab } from '../store/layout/layout.actions';
import { IReduxAction } from '../types';

export enum shortcutModifiers {
  general = 'mod', // Translates to 'command' on Mac and 'ctrl' on Windows/Linux
}

const shortcuts = [
  {
    action: closeTab(),
    key: 'w',
    label: 'Close Tab',
    modifier: shortcutModifiers.general,
  }
]

interface IShortcut {
  action?: IReduxAction,
  // tslint:disable-next-line:no-any
  handler?: (event?: any) => void,
  key: string,
  label: string,
  modifier: shortcutModifiers
}

/**
 * Attach a new shortcut event
 */
export const attachIndividualShortcut = (shortcut: IShortcut, dispatch?: Dispatch) => {
  const { action, handler, label, key, modifier, } = shortcut


  Mousetrap.bind(
    `${modifier}+${key}`,
    () => {
      logger.info('Triggering shortcut with label: ', label)

      if (handler && typeof handler === 'function') {
        handler()
        return false
      }

      if (dispatch && action) {
        // Dispatch Redux action
        dispatch(action)
        return false
      }

      // NOTE: Returning "false" prevents default behaviour and stops the event from bubbling
    }
  )
}

/**
 * Attach application shortcuts to the application
 * @param {Dispatch} dispatch Redux dispatch action
 */
export const registerGlobalShortcuts = (dispatch: Dispatch) => {
  shortcuts.forEach((shortcut) => attachIndividualShortcut(shortcut, dispatch))
}

/**
 * Remove a shortcut attached to a key
 */
export const unregisterShortcut = (key: string) => Mousetrap.unbind(key)