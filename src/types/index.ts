import { IProject } from "./projects";


export interface IReduxAction {
  payload: object;
  type: string;
}

export interface IStoreState {
  projects: IProject
}