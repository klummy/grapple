import initialState from './projects.state';
import {
  ADD_PROTO_TO_PROJECT,
  NEW_PROJECT,
  REMOVE_PROTO_FROM_PROJECT,
  UPDATE_PROTO,
} from './projects.types';

import { IReduxAction } from '../../types';
import { IProject } from '../../types/projects';
import { IProto } from '../../types/protos';

const projectsReducer = (
  state: IProject = initialState,
  { payload, type }: IReduxAction,
): IProject => {
  switch (type) {
    case ADD_PROTO_TO_PROJECT: {
      const payloadProto = payload as IProto;

      return {
        ...state,
        protos: [...state.protos, payloadProto],
      };
    }

    case NEW_PROJECT:
      return state;

    case REMOVE_PROTO_FROM_PROJECT:
      return {
        ...state,
        protos: state.protos.filter(item => item.path !== (payload as IProto).path),
      };

    case UPDATE_PROTO: {
      const payloadProto = payload as IProto;

      const protos = state.protos.map((proto) => {
        if (proto.path === payloadProto.path) {
          return payloadProto;
        }

        return proto;
      });

      return {
        ...state,
        protos,
      };
    }

    default:
      return state;
  }
};

export default projectsReducer;
