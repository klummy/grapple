import { MethodDefinition } from '@grpc/proto-loader';
import React, { useContext } from 'react';

import { IProto } from '../../types/protos';
import NavProtoItem from './NavProtoItem';
import { NavProtoListContainer } from './NavProtoList.components';
import { ProjectContext } from '../../contexts';

export type INavProtoEventHandler = (proto: IProto) => void


export interface INavProtoListProps {
  newTabHandler: (
    e: React.MouseEvent,
    proto: IProto,
    service: MethodDefinition<{}, {}>
  ) => void;
  protos: IProto[],
  refreshProto: INavProtoEventHandler
}

const NavProtoList: React.SFC<INavProtoListProps> = ({
  protos: originalProtos,
  newTabHandler,
  refreshProto,
}) => {
  const {
    state: {
      filteredProtos,
      searchTerm,
    },
  } = useContext(ProjectContext);

  const protos = searchTerm ? filteredProtos : originalProtos;

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
