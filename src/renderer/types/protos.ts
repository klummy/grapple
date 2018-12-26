import { PackageDefinition } from "@grpc/proto-loader";

export interface IProto {
  lastModified: number,
  name: string
  path: string
  pkgDef?: PackageDefinition
}