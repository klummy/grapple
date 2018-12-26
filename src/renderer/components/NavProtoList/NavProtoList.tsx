import { MethodDefinition } from '@grpc/proto-loader';
import * as React from 'react';

import logger from '../../libs/logger';
import { IProto } from '../../types/protos';
import {
  NavProtoItemContainer,
  NavProtoItemHeader,
  NavProtoItemServicesItem,
  NavProtoItemServicesList,
  NavProtoListContainer,
} from './NavProtoList.components';

export interface INavProtoItemProps {
  newTabHandler: (e: React.MouseEvent, proto: IProto, service: MethodDefinition<{}, {}>) => void
  proto: IProto
}


const NavProtoItem: React.SFC<INavProtoItemProps> = ({ proto, newTabHandler }) => {
  const { pkgDef } = proto

  if (!pkgDef) {
    logger.error('Package definitions not present in proto definition')
    return null
  }

  // Service name
  const pkgIndex = Object.keys(pkgDef)[0]
  const pkgName = (pkgIndex.match(/\.[^.]*$/) || [''])[0].replace('.', '')

  const servicesObj = pkgDef[pkgIndex]
  const services = Object.keys(servicesObj)
    .map(key => servicesObj[key])
    .sort((a, b) => {
      const aName = a.originalName || ''
      const bName = b.originalName || ''

      return aName.localeCompare(bName, 'en', {
        sensitivity: 'base'
      })
    })

  return (
    <NavProtoItemContainer>
      <NavProtoItemHeader>
        { pkgName }
      </NavProtoItemHeader>

      <NavProtoItemServicesList>
        {
          services.map(service => (
            <NavProtoItemServicesItem
              key={ service.originalName }
              onClick={ (e) => newTabHandler(e, proto, service) }
            >
              { service.originalName }
            </NavProtoItemServicesItem>
          ))
        }
      </NavProtoItemServicesList>
    </NavProtoItemContainer>
  )
}

export interface INavProtoListProps {
  newTabHandler: (e: React.MouseEvent, proto: IProto, service: MethodDefinition<{}, {}>) => void
  protos: Array<IProto>
}

const NavProtoList: React.SFC<INavProtoListProps> = ({ newTabHandler, protos }) => {
  return (
    <React.Fragment>
      {
        Array.isArray(protos) && protos.length > 0 && (
          <NavProtoListContainer>
            {
              protos.map(proto => <NavProtoItem
                newTabHandler={ newTabHandler }
                key={ proto.name }
                proto={ proto } />
              )
            }
          </NavProtoListContainer>
        )
      }
    </React.Fragment>
  );
}

export default NavProtoList;