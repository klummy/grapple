import { MethodDefinition } from '@grpc/proto-loader';
import * as React from 'react';
import { connect } from 'react-redux';

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
import { addNotification } from '../../store/layout/layout.actions';
import { removeProtoFromProject } from '../../store/projects/projects.actions';

import cuid = require('cuid');

export interface INavProtoItemProps {
  newTabHandler: (
    e: React.MouseEvent,
    proto: IProto,
    service: MethodDefinition<{}, {}>
  ) => void;
  notify: (item: INotification) => void
  proto: IProto;
  refreshProto: (proto: IProto) => void;
  removeProto: (proto: IProto) => void
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
  notify,
  proto,
  refreshProto,
  removeProto,
}) => {
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

const mapDispatchToProps = {
  notify: (item: INotification) => addNotification(item),
  removeProto: (proto: IProto) => removeProtoFromProject(proto),
};

export default connect(null, mapDispatchToProps)(NavProtoItem);
