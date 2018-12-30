import { MethodDefinition } from '@grpc/proto-loader';

import { IProto } from "./protos";

export interface ITab {
  id?: string
  name?: string
  proto?: IProto
  results?: object
  service?: MethodDefinition<{}, {}>
}

export interface ILayout {
  activeTab: string
  tabs: Array<ITab>
}