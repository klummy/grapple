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
    message: `"${proto.name}" deleted`,
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

  // Service name
  const pkgIndex = Object.keys(pkgDef)[0];
  const pkgName = (pkgIndex.match(/\.[^.]*$/) || [''])[0].replace('.', '');

  const servicesObj = pkgDef[pkgIndex];
  const services = Object.keys(servicesObj)
    .map(key => servicesObj[key])
    .sort((a, b) => {
      const aName = a.originalName || '';
      const bName = b.originalName || '';

      return aName.localeCompare(bName, 'en', {
        sensitivity: 'base',
      });
    });

  return (
    <NavProtoItemContainer>
      <NavProtoItemHeaderContainer>
        <NavProtoItemHeader>{pkgName}</NavProtoItemHeader>

        <NavProtoItemHeaderIcon
          className="ti-trash"
          onClick={() => handleRemoveProto(proto, removeProto, notify)}
        />
      </NavProtoItemHeaderContainer>

      <NavProtoItemServicesList>
        {services.map(service => (
          <NavProtoItemServicesItem
            key={service.originalName}
            onClick={e => newTabHandler(e, proto, service)}
          >
            {service.originalName}
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
