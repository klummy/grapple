import { MethodDefinition } from '@grpc/proto-loader';

import { IProto } from "./protos";

export interface ITab {
  address?: string
  id?: string
  name?: string
  proto?: IProto
  queryData?: object
  results?: object
  service?: MethodDefinition<{}, {}>
}

export interface ILayout {
  activeTab: string
  tabs: Array<ITab>
}