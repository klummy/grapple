import { combineReducers, Reducer } from 'redux';

import layout from './layout/layout.reducer';
import projects from './projects/projects.reducer';

const appReducers = combineReducers({
  layout,
  projects,
});

const rootReducer: Reducer = (oldState, action) => {
  let state = oldState;

  if (action.type === 'REHYDRATE_STORE') {
    state = action.payload;
  }

  return appReducers(state, action);
};

export default rootReducer;
