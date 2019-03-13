import { IProto } from './protos';

export interface IProjectConfig {
  // TODO: Remove theme and populate this.
  theme?: string;
}

export interface IProject {
  config: IProjectConfig;
  filteredProtos: IProto[];
  name: string;
  protos: IProto[];
  searchTerm: string;
}

export interface ISearchProtoPayload {
  filteredProtos: IProto[],
  searchTerm: string
}
