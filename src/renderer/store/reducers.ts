import { combineReducers, Reducer } from 'redux';

import layout from './layout/layout.reducer';
import projects from './projects/projects.reducer';

const appReducers = combineReducers({
  layout,
  projects,
});

const rootReducer: Reducer = (state, action) => {
  if (action.type === 'REHYDRATE_STORE') {
    state = action.payload;
  }

  return appReducers(state, action);
};

export default rootReducer;
