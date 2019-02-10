import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";

import persistMiddleware from "./middlewares/persistor";
import reducers from "./reducers";

const middlewares = applyMiddleware(logger, persistMiddleware);

const store = createStore(reducers, middlewares);

export default store;
