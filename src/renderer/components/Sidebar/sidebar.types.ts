import { MethodDefinition } from '@grpc/proto-loader';

import { IProto } from '../../types/protos';
import { INotification } from '@/renderer/types/layout';

export interface ISidebarProps {
  addProtoToProject: (proto: IProto) => void;
  addTab: (proto: IProto, service: MethodDefinition<{}, {}>) => void;
  notify: (item: INotification) => void;
  protos: IProto[];
  updateProto: (proto: IProto) => void
}

export interface ISidebarState {
  dragInProgress: boolean;
}
