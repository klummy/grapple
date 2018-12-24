import cuid from 'cuid';

import { IProto } from '../..//types/protos';
import { IReduxAction } from '../../types';
import { ILayout, ITab } from '../../types/layout';
import initialState from './layout.state';
import { CLOSE_TAB, NEW_TAB } from './layout.types';

const layoutReducer = (state: ILayout = initialState, { payload, type }: IReduxAction): ILayout => {
  switch (type) {
    case NEW_TAB:
      const proto = (payload as IProto)

      const tabs: Array<ITab> = Array.from(state.tabs)
      const tab = {
        id: cuid(),
        proto
      }

      tabs.push(tab)

      return {
        ...state,
        tabs
      }

    case CLOSE_TAB:
      const targetTab = (payload as ITab)

      return {
        ...state,
        tabs: state.tabs.filter(tabItem => tabItem.id !== targetTab.id)
      }

    default:
      return state

  }
}

export default layoutReducer;