import { IProto } from "../../types/protos";

export interface ISidebarProps {
  addProtoToProject: (proto: IProto) => void
}

export interface ISidebarState {
  actionInProgress?: boolean
  dragInProgress: boolean
}