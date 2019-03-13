import { PackageDefinition } from '@grpc/proto-loader';

export interface IProto {
  lastModified: number;
  isMultipleService?: boolean;
  name: string;
  path: string;
  pkgName?: string;
  pkgDef?: PackageDefinition;
  // TODO: Add proper types below
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  services?: any[];
}
