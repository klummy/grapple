import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger'
import reducers from './reducers';

const middlewares = applyMiddleware(logger)

const store = createStore(reducers, middlewares)

export default store