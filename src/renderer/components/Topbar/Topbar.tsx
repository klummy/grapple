import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import TabList from '../TabList';
import Logo from '../Logo';

import { Input } from '../GenericComponents';
import { LogoContainer, TopbarContainer } from './Topbar.components';

import * as projectActions from '../../store/projects/projects.actions';

import { IStoreState } from '@/renderer/types';
import { IProto } from '@/renderer/types/protos';
import { ISearchProtoPayload } from '@/renderer/types/projects';

export interface ITopbarProps {
  protos: IProto[]
  searchProtoList: (payload: ISearchProtoPayload) => void,
}

const Topbar: React.SFC<ITopbarProps> = ({ protos, searchProtoList }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const searchOptions = {
    keys: ['services.path'],
  };

  let fuse = new Fuse(protos, searchOptions);

  useEffect(() => {
    // Clear and recreate the index when the proto list is modified
    fuse = new Fuse(protos, searchOptions);
  }, [protos]);

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Do search here
    const val = event.target.value;
    setSearchTerm(val);

    const results = fuse.search(val);
    searchProtoList({
      filteredProtos: results,
      searchTerm: val,
    });
  };

  return (
    <TopbarContainer>
      <LogoContainer>
        <Logo />

        {/* Search */}
        <Input
          name="search"
          onChange={handleSearchTermChange}
          placeholder="Search"
          type="search"
          value={searchTerm}
        />
      </LogoContainer>

      <TabList />
    </TopbarContainer>
  );
};

const mapStateToProps = (state: IStoreState) => ({
  protos: state.projects.protos,
});

const mapDispatchToProps = {
  searchProtoList: (payload: ISearchProtoPayload) => projectActions.searchProtoList(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
