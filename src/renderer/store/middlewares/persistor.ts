import { Middleware as ReduxMiddlewareType } from 'redux';

const persistMiddleware: ReduxMiddlewareType = ({ getState }) => {
  return next => action => {
    const returnValue = next(action) // Perform action
    // const currentState = getState() // Current state

    return returnValue
  }
}

export default persistMiddleware;