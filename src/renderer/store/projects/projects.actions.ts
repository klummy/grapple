import { ADD_PROTO_TO_PROJECT, NEW_PROJECT, REMOVE_PROTO_FROM_PROJECT } from './projects.types';

import { IProject } from '../../types/projects';
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
