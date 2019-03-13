import {
  ADD_PROTO_TO_PROJECT,
  NEW_PROJECT,
  REMOVE_PROTO_FROM_PROJECT,
  SEARCH_PROTO_LIST,
  UPDATE_PROTO,
} from './projects.types';

import { IProject, ISearchProtoPayload } from '../../types/projects';
import { IProto } from '../../types/protos';

export const newProject = (project: IProject) => ({
  payload: project,
  type: NEW_PROJECT,
});

export const addProtoToProject = (proto: IProto) => ({
  payload: proto,
  type: ADD_PROTO_TO_PROJECT,
});

export const removeProtoFromProject = (proto: IProto) => ({
  payload: proto,
  type: REMOVE_PROTO_FROM_PROJECT,
});

export const searchProtoList = (payload: ISearchProtoPayload) => ({
  payload,
  type: SEARCH_PROTO_LIST,
});

export const updateProto = (payload: IProto) => ({
  payload,
  type: UPDATE_PROTO,
});
