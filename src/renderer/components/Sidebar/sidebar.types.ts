import { IProto } from "../../types/protos";

export interface ISidebarProps {
  addProtoToProject: (proto: IProto) => void
  protos: Array<IProto>
}

export interface ISidebarState {
  actionInProgress?: boolean
  dragInProgress: boolean
}