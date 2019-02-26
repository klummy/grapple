import { Middleware as ReduxMiddlewareType } from 'redux';
import omit from 'lodash.omit';

import config from '../../../common/config';
import storage from '../storage';
import { IStoreState } from '../../types';

const persistMiddleware: ReduxMiddlewareType = ({ getState }) => {
  return next => (action) => {
    const returnValue = next(action); // Perform action
    const currentState: IStoreState = getState(); // Current state

    const filteredStateData: IStoreState = {
      ...currentState,
      layout: {
        ...currentState.layout,
        notifications: [],
        tabs: currentState.layout.tabs.map(tab => omit(tab, ['inProgress', 'meta', 'results'])),
      },
    };

    storage.setItem(config.storage.main, filteredStateData);

    return returnValue;
  };
};

export default persistMiddleware;
