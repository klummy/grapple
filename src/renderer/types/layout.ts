import { MethodDefinition } from '@grpc/proto-loader';

import { IProto } from './protos';

export enum ITabStatus {
  error = 'error',
  success = 'success',
}

export interface ITabMeta {
  code?: Number, // Request code.
  status: ITabStatus,
  timestamp: number, // Milliseconds
}

export interface ITab {
  address?: string; // Service address
  id?: string; // Unique identifier
  inProgress?: boolean; // Flag if a request is in progress, not cached
  meta?: ITabMeta, // Meta around request
  metadata?: object, // Native gRPC request metadata sent to server
  name?: string; // Custom tab name. TODO: Consider implementing functionality on tabs or remove
  proto?: IProto; // Proto for tab
  queryData?: object; // Query payload
  results?: object; // Results for page, not cached
  service?: MethodDefinition<{}, {}>; // Service for tab
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
