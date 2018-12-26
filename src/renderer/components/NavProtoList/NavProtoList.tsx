import { MethodDefinition } from '@grpc/proto-loader';
import * as React from 'react';

import { IProto } from '../../types/protos';
import NavProtoItem from './NavProtoItem';
import {
  NavProtoListContainer,
} from './NavProtoList.components';

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