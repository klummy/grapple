import { MethodDefinition } from '@grpc/proto-loader';
import * as React from 'react';

import { IProto } from '../../types/protos';
import NavProtoItem from './NavProtoItem';
import { NavProtoListContainer } from './NavProtoList.components';

export type INavProtoEventHandler = (proto: IProto) => void


export interface INavProtoListProps {
  newTabHandler: (
    e: React.MouseEvent,
    proto: IProto,
    service: MethodDefinition<{}, {}>
  ) => void;
  protos: IProto[];
  refreshProto: INavProtoEventHandler
}

const NavProtoList: React.SFC<INavProtoListProps> = ({
  newTabHandler,
  protos,
  refreshProto,
}) => {
  return (
    <React.Fragment>
      {Array.isArray(protos) && protos.length > 0 && (
        <NavProtoListContainer>
          {protos.map(proto => (
            <NavProtoItem
              key={proto.name}
              newTabHandler={newTabHandler}
              proto={proto}
              refreshProto={refreshProto}
            />
          ))}
        </NavProtoListContainer>
      )}
    </React.Fragment>
  );
};

export default NavProtoList;
