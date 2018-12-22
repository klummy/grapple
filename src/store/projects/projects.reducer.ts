import initialState from './projects.state';
import { ADD_PROTO_TO_PROJECT, NEW_PROJECT } from './projects.types';

import { IProject } from 'types/projects';
import { IProto } from 'types/protos';
import { IReduxAction } from '../../types';

const projectsReducer = (state: IProject = initialState, { payload, type }: IReduxAction) => {


  switch (type) {
    case ADD_PROTO_TO_PROJECT:
      state.protos.push(payload as IProto)

      return state

    case NEW_PROJECT:
      // tslint:disable-next-line no-console
      console.log('New project => ');
      return state

    default:
      return state
  }
}

export default projectsReducer;