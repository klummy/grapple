import { Middleware as ReduxMiddlewareType } from 'redux';

import config from 'common/config';
import storage from '../storage';

const persistMiddleware: ReduxMiddlewareType = ({ getState }) => {
  return next => action => {
    const returnValue = next(action) // Perform action
    const currentState = getState() // Current state

    storage.setItem(config.storage.main, currentState)

    return returnValue
  }
}

export default persistMiddleware;