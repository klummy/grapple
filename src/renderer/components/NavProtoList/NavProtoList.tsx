import { MethodDefinition } from '@grpc/proto-loader';
import * as React from 'react';

import { IProto } from '../../types/protos';
import NavProtoItem from './NavProtoItem';
import { NavProtoListContainer } from './NavProtoList.components';
import { connect } from 'react-redux';
import { IStoreState } from '@/renderer/types';

export type INavProtoEventHandler = (proto: IProto) => void


export interface INavProtoListProps {
  filteredProtos: IProto[];
  newTabHandler: (
    e: React.MouseEvent,
    proto: IProto,
    service: MethodDefinition<{}, {}>
  ) => void;
  protos: IProto[];
  refreshProto: INavProtoEventHandler
  searchTerm: string
}

const NavProtoList: React.SFC<INavProtoListProps> = ({
  filteredProtos,
  newTabHandler,
  protos: originalProtos,
  refreshProto,
  searchTerm,
}) => {
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

const mapStateToProps = (state: IStoreState) => ({
  filteredProtos: state.projects.filteredProtos,
  searchTerm: state.projects.searchTerm,
});

export default connect(mapStateToProps)(NavProtoList);
