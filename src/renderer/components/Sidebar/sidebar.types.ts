import { MethodDefinition } from "@grpc/proto-loader";

import { IProto } from "../../types/protos";

export interface ISidebarProps {
  addProtoToProject: (proto: IProto) => void
  addTab: (proto: IProto, service: MethodDefinition<{}, {}>) => void
  protos: Array<IProto>
}

export interface ISidebarState {
  actionInProgress?: boolean
  dragInProgress: boolean
}