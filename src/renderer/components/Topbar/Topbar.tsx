import React from 'react';

import TabList from '../TabList';
import Logo from '../Logo';

import { Input as SearchInput } from '../GenericComponents';

import { LogoContainer, TopbarContainer } from './Topbar.components';

const Topbar: React.SFC<{}> = () => {
  return (
    <TopbarContainer>
      <LogoContainer>
        <Logo />

        {/* Search */}
        {/* TODO: Implement functionality */}
        <SearchInput
          placeholder="Search"
          type="search"
        />
      </LogoContainer>

      <TabList />
    </TopbarContainer>
  );
};

export default Topbar;
