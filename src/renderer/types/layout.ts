import { IProto } from "./protos";

export interface ITab {
  id?: string
  name?: string
  proto?: IProto
}

export interface ILayout {
  activeTab: string
  tabs: Array<ITab>
}