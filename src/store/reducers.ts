import { combineReducers } from "redux";
import projects from './projects/projects.reducer';

const reducers = combineReducers({
  projects
})

export default reducers;