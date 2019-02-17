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
  removeProto: (proto: IProto) => void
}

const handleRemoveProto = (
  proto: IProto, removeProto: (proto: IProto) => void, notify: (item: INotification) => void,
) => {
  removeProto(proto);
  notify({
    id: cuid(),
    message: `"${proto.name}" removed`,
    title: 'Deleted',
    type: notificationTypes.success,
  });
};

const NavProtoItem: React.SFC<INavProtoItemProps> = ({
  proto, newTabHandler, notify, removeProto,
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
      return !item.type
        ? item
        : null;
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

        <NavProtoItemHeaderIcon
          className="ti-trash"
          onClick={() => handleRemoveProto(proto, removeProto, notify)}
        />
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
