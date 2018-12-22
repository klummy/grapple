import { IProto } from './protos';

export interface IProjectConfig {
  // TODO: Remove theme and populate this.
  theme?: string
}

export interface IProject {
  name: string
  config: IProjectConfig
  protos: Array<IProto>
}

