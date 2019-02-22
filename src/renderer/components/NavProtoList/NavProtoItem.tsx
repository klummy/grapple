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
  const { pkgDef } = proto;

  if (!pkgDef) {
    logger.error('Package definitions not present in proto definition');
    return null;
  }

  const serviceDefs = Object.keys(pkgDef)
    .map((key) => {
      const item = pkgDef[key];

      // The pkgDef contains all types in the proto file,
      // get the services which don't have a type property
      return item.type
        ? null
        : item;
    })
    .filter(item => item);

  const services = serviceDefs
    .map((service) => {
      if (!service) {
        return null;
      }

      return Object.keys(service)
        .map((key) => {
          const item = service[key];
          return {
            ...item,
            formattedPath: (item.path.match(/\.[^.]*$/)[0] || '').replace('.', ''),
          };
        })
        .sort((a, b) => {
          const aName = a.formattedPath || '';
          const bName = b.formattedPath || '';

          return aName.localeCompare(bName, 'en', {
            sensitivity: 'base',
          });
        });
    })
    .filter(item => item)
    .flat()
    .sort((a, b) => {
      const aName = a.formattedPath || '';
      const bName = b.formattedPath || '';

      return aName.localeCompare(bName, 'en', {
        sensitivity: 'base',
      });
    });

  // Flag to know if it's just one service or multiple in the proto file
  const isMultipleService = Object.keys(serviceDefs).length > 1;

  // If it's a single package, attach the service name to the package name
  const pkgName = isMultipleService
    ? proto.name
    : `${proto.name}.${services[0].formattedPath.split('/')[0]}`;

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
