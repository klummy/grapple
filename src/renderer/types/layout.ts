import { MethodDefinition } from '@grpc/proto-loader';

import { IProto } from "./protos";

export interface ITab {
  id?: string
  name?: string
  proto?: IProto
  service?: MethodDefinition<{}, {}>
}

export interface ILayout {
  activeTab: string
  tabs: Array<ITab>
}