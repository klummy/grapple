import React, { useEffect, useState, useContext } from 'react';
import Fuse from 'fuse.js';

import TabList from '../TabList';
import Logo from '../Logo';

import { Input } from '../GenericComponents';
import { LogoContainer, TopbarContainer } from './Topbar.components';

import * as projectActions from '../../store/projects/projects.actions';

// import { IStoreState } from '@/renderer/types';
// import { IProto } from '@/renderer/types/protos';
import { ISearchProtoPayload } from '@/renderer/types/projects';
import { ProjectContext } from '../../contexts';

const Topbar: React.SFC<{}> = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const {
    dispatch: projectDispatcher,
    state: { protos },
  } = useContext(ProjectContext);

  const searchProtoList = (payload: ISearchProtoPayload) => projectDispatcher(projectActions.searchProtoList(payload));

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

export default Topbar;
