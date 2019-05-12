import { MethodDefinition } from '@grpc/proto-loader';
import React, { useContext } from 'react';

import logger from '../../libs/logger';
import { IProto } from '../../types/protos';
import {
  NavProtoItemContainer,
  NavProtoItemHeader,
  NavProtoItemHeaderContainer,
  NavProtoItemHeaderIcon,
  NavProtoItemHeaderIconContainer,
  NavProtoItemServicesItem,
  NavProtoItemServicesList,
} from './NavProtoList.components';
import { INotification, notificationTypes } from '../../types/layout';
import { removeProtoFromProject } from '../../store/projects/projects.actions';
import { ProjectContext, LayoutContext } from '../../contexts';

import cuid = require('cuid');

export interface INavProtoItemProps {
  newTabHandler: (
    e: React.MouseEvent,
    proto: IProto,
    service: MethodDefinition<{}, {}>
  ) => void;
  proto: IProto;
  refreshProto: (proto: IProto) => void;
}

enum INavProtoActions {
  reload = 'reload',
  remove = 'remove',
  watch = 'watch',
}

const navProtoActions = {
  [INavProtoActions.reload]: {
    message: (proto: IProto) => `"${proto.name}" reloaded`,
    title: 'Refreshed',
    type: notificationTypes.success,
  },
  [INavProtoActions.remove]: {
    message: (proto: IProto) => `"${proto.name}" removed`,
    title: 'Removed',
    type: notificationTypes.success,
  },
  [INavProtoActions.watch]: {
    message: (proto: IProto) => `Watching "${proto.name}"`,
    title: 'Success',
    type: notificationTypes.success,
  },
};

const dispatchNavProtoAction = (
  proto: IProto,
  handler: (proto: IProto) => void,
  notify: (item: INotification) => void,
  actionType: INavProtoActions,
) => {
  handler(proto);

  const {
    message,
    title,
    type,
  } = navProtoActions[actionType];

  notify({
    id: cuid(),
    message: message(proto),
    title,
    type,
  });
};

const NavProtoItem: React.SFC<INavProtoItemProps> = ({
  newTabHandler,
  proto,
  refreshProto,
}) => {
  const { notify } = useContext(LayoutContext);
  const { dispatch: projectDispatcher } = useContext(ProjectContext);

  const removeProto = () => projectDispatcher(removeProtoFromProject(proto));

  const {
    pkgDef, pkgName, services, isMultipleService,
  } = proto;

  if (!pkgDef || !Array.isArray(services)) {
    logger.error('Package definitions not present in proto definition');
    return null;
  }

  return (
    <NavProtoItemContainer>
      <NavProtoItemHeaderContainer>
        <NavProtoItemHeader title={pkgName}>
          {pkgName}
        </NavProtoItemHeader>

        <NavProtoItemHeaderIconContainer>
          <NavProtoItemHeaderIcon
            className="ti-reload"
            onClick={() => dispatchNavProtoAction(
              proto,
              refreshProto,
              notify,
              INavProtoActions.reload,
            )}
            title="Refresh proto file"
          />

          {/* TODO: https://github.com/klummy/grapple/issues/37 */}
          {/* <NavProtoItemHeaderIcon
            className="ti-eye"
            onClick={() => dispatchNavProtoAction(
              proto, removeProto, notify, INavProtoActions.watch,
            )}
            title="Auto watch files"
          /> */}

          <NavProtoItemHeaderIcon
            className="ti-trash"
            onClick={() => dispatchNavProtoAction(
              proto, removeProto, notify, INavProtoActions.remove,
            )}
            title="Remove proto"
          />
        </NavProtoItemHeaderIconContainer>
      </NavProtoItemHeaderContainer>

      <NavProtoItemServicesList>
        {services.map(service => (
          <NavProtoItemServicesItem
            key={service.path}
            onClick={e => newTabHandler(e, proto, service)}
          >
            {
              isMultipleService
                ? service.formattedPath
                : service.originalName
            }
          </NavProtoItemServicesItem>
        ))}
      </NavProtoItemServicesList>
    </NavProtoItemContainer>
  );
};


export default NavProtoItem;
