import Mousetrap from 'mousetrap';
import { Dispatch } from 'react';

import logger from '../libs/logger';
import { closeTab } from '../store/layout/layout.actions';
import { IReduxAction } from '../types';

export enum shortcutModifiers {
  general = 'mod' // Translates to 'command' on Mac and 'ctrl' on Windows/Linux
}

const shortcuts = [
  {
    action: closeTab(),
    actionNamespace: 'layout',
    key: 'w',
    label: 'Close Tab',
    modifier: shortcutModifiers.general,
  },
];

interface IShortcut {
  action?: IReduxAction; // Dispatch a store action
  actionNamespace?: string; // Action namespace from IStoreState
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler?: (event?: any) => void;
  key: string;
  label: string;
  modifier: shortcutModifiers;
}

/**
 * Attach a new shortcut event
 */
export const attachIndividualShortcut = (
  shortcut: IShortcut,
  dispatchers?: IDispatchers,
) => {
  const {
    action,
    actionNamespace,
    handler,
    label,
    key,
    modifier,
  } = shortcut;

  Mousetrap.bind(`${modifier}+${key}`, () => {
    logger.info('Triggering shortcut with label: ', label);

    if (handler && typeof handler === 'function') {
      handler();
      return false;
    }

    if (dispatchers && actionNamespace) {
      const dispatch = dispatchers[actionNamespace];

      if (dispatch && action) {
        // Dispatch Redux action
        dispatch(action);
        return false;
      }
    }

    // NOTE: Returning "false" prevents default behaviour and stops the event from bubbling
    return true;
  });
};

export interface IDispatchers {
  [key: string]: Dispatch<IReduxAction>
}

/**
 * Attach application shortcuts to the application
 * @param {Dispatch} dispatch Redux dispatch action
 */
export const registerGlobalShortcuts = (dispatch: IDispatchers) => {
  shortcuts.forEach(shortcut => attachIndividualShortcut(shortcut, dispatch));
};

/**
 * Remove a shortcut attached to a key
 */
export const unregisterShortcut = (key: string) => Mousetrap.unbind(key);
