import cuid from 'cuid';

import { IReduxAction } from '../../types';
import { ILayout, ITab, INotification } from '../../types/layout';
import {
  CLOSE_TAB, NEW_TAB, SWITCH_TAB, UPDATE_TAB, ADD_NOTIFICATION, REMOVE_NOTIFICATION,
} from './layout.types';

const layoutReducer = (
  state: ILayout,
  { payload, type }: IReduxAction,
): ILayout => {
  switch (type) {
    case 'REHYDRATE': {
      if (payload) {
        return {
          ...(payload as ILayout),
        };
      }
      return state;
    }

    case NEW_TAB: {
      const tabData = payload as ITab;

      const { proto, service } = tabData;

      const tabs: ITab[] = Array.from(state.tabs);
      const id = cuid();

      let name = '';

      if (proto && service) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name = (service as any).formattedPath;
      }

      const tab = {
        id,
        name,
        proto,
        service,
      };

      tabs.push(tab);

      return {
        ...state,
        activeTab: id,
        tabs,
      };
    }

    case CLOSE_TAB: {
      const { activeTab } = state;

      // When no payload is passed, close the current tab (e.g. when the keyboard shortcut is used)
      const tabToCloseID = payload ? (payload as ITab).id : state.activeTab;

      if (!tabToCloseID) {
        return state;
      }

      // If the targetTab and the active tab are the same thing, use the last tab in the sequence
      // Else, use the current active tab
      const newTabs = state.tabs.filter(tabItem => tabItem.id !== tabToCloseID);
      const lastTab = newTabs[newTabs.length - 1] || {};
      const newActiveTab = tabToCloseID === activeTab
        ? lastTab.id || ''
        : activeTab;

      return {
        ...state,
        activeTab: newActiveTab,
        tabs: newTabs,
      };
    }

    case UPDATE_TAB: {
      const updatedTab = payload as ITab;

      const tabs = state.tabs.map((tab) => {
        if (tab.id === updatedTab.id) {
          return updatedTab;
        }

        return tab;
      });

      return {
        ...state,
        tabs,
      };
    }

    case SWITCH_TAB:
      return {
        ...state,
        activeTab: (payload as ITab).id || '',
      };

    case ADD_NOTIFICATION: {
      const notification = payload as INotification;

      return {
        ...state,
        notifications: [
          ...state.notifications,
          notification,
        ],
      };
    }

    case REMOVE_NOTIFICATION:

      return {
        ...state,
        notifications:
          state.notifications.filter(item => item.id !== (payload as INotification).id),
      };

    default:
      return state;
  }
};

export default layoutReducer;
