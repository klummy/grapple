import cuid from 'cuid';

import { IReduxAction } from '../../types';
import { ILayout, ITab } from '../../types/layout';
import initialState from './layout.state';
import { CLOSE_TAB, NEW_TAB, SWITCH_TAB } from './layout.types';

const layoutReducer = (state: ILayout = initialState, { payload, type }: IReduxAction): ILayout => {
  switch (type) {
    case NEW_TAB:
      const tabData = (payload as ITab)

      const { proto, service } = tabData

      const tabs: Array<ITab> = Array.from(state.tabs)
      const id = cuid()

      const tab = {
        id,
        proto,
        service
      }

      tabs.push(tab)

      return {
        ...state,
        activeTab: id,
        tabs
      }

    case CLOSE_TAB:
      const targetTab = (payload as ITab)

      return {
        ...state,
        activeTab: '',
        tabs: state.tabs.filter(tabItem => tabItem.id !== targetTab.id)
      }

    case SWITCH_TAB:
      return {
        ...state,
        activeTab: (payload as ITab).id || ''
      }

    default:
      return state

  }
}

export default layoutReducer;