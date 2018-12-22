import initialState from './projects.state';
import { ADD_PROTO_TO_PROJECT, NEW_PROJECT } from './projects.types';

import { IProject } from 'types/projects';
import { IProto } from 'types/protos';
import { IReduxAction } from '../../types';

const projectsReducer = (state: IProject = initialState, { payload, type }: IReduxAction) => {


  switch (type) {
    case ADD_PROTO_TO_PROJECT:
      const payloadProto = (payload as IProto)
      const existsAlready = state.protos.find((proto) => proto.path === payloadProto.path)

      if (!existsAlready) {
        state.protos.push(payloadProto)
      }

      return state

    case NEW_PROJECT:
      return state

    default:
      return state
  }
}

export default projectsReducer;