import { ADD_PROTO_TO_PROJECT, IProject, IProto, NEW_PROJECT } from "./projects.types";

export const newProject = (project: IProject) => ({
  payload: project,
  type: NEW_PROJECT
})

export const addProtoToProject = (proto: IProto) => ({
  payload: proto,
  type: ADD_PROTO_TO_PROJECT,
})