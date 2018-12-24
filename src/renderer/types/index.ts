import { ILayout } from "./layout";
import { IProject } from "./projects";


export interface IReduxAction {
  payload: object;
  type: string;
}

export interface IStoreState {
  layout: ILayout
  projects: IProject
}