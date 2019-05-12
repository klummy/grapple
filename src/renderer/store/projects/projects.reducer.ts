import {
  ADD_PROTO_TO_PROJECT,
  NEW_PROJECT,
  REMOVE_PROTO_FROM_PROJECT,
  SEARCH_PROTO_LIST,
  UPDATE_PROTO,
} from './projects.types';

import { IReduxAction } from '../../types';
import { IProject, ISearchProtoPayload } from '../../types/projects';
import { IProto } from '../../types/protos';

const projectsReducer = (
  state: IProject,
  { payload, type }: IReduxAction,
): IProject => {
  switch (type) {
    case 'REHYDRATE': {
      if (payload) {
        return {
          ...(payload as IProject),
        };
      }
      return state;
    }

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

    case SEARCH_PROTO_LIST: {
      const { filteredProtos, searchTerm } = payload as ISearchProtoPayload;

      return {
        ...state,
        filteredProtos: (filteredProtos as IProto[]),
        searchTerm,
      };
    }

    default:
      return state;
  }
};

export default projectsReducer;
