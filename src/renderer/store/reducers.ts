import { combineReducers, Reducer } from "redux";
import projects from './projects/projects.reducer';

const appReducers = combineReducers({
  projects
})

const rootReducer: Reducer = (state, action) => {
  if (action.type === 'REHYDRATE_STORE') {
    state = action.payload
  }

  return appReducers(state, action)
}

export default rootReducer;