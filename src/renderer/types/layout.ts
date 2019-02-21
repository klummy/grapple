import { MethodDefinition } from '@grpc/proto-loader';

import { IProto } from './protos';

export enum ITabStatus {
  error = 'error',
  success = 'success',
}

export interface ITabMeta {
  status: ITabStatus,
  timestamp: number, // Milliseconds
}

export interface ITab {
  address?: string;
  id?: string;
  inProgress?: boolean;
  meta?: ITabMeta,
  name?: string;
  proto?: IProto;
  queryData?: object;
  results?: object;
  service?: MethodDefinition<{}, {}>;
}

export interface ILayout {
  activeTab: string;
  tabs: ITab[];
  notifications: INotification[]
}

export enum notificationTypes {
  error = 'error',
  info = 'info',
  success = 'success',
  warn = 'warn',
}

export interface INotification {
  id: string
  message: string,
  rawErr?: Error
  type: notificationTypes
  title: string,
}
