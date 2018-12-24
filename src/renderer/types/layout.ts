import { IProto } from "./protos";

export interface ITab {
  id?: string
  name?: string
  proto?: IProto
}

export interface ILayout {
  tabs: Array<ITab>
}