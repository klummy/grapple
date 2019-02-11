import React from "react";

import TabList from "../TabList";
import Logo from "../Logo";

import {
  LogoContainer,
  SearchInput,
  TopbarContainer
} from "./Topbar.components";

export interface ITopbarProps {}

const Topbar: React.SFC<ITopbarProps> = () => {
  return (
    <TopbarContainer>
      <LogoContainer>
        <Logo />

        {/* Search */}
        {/* TODO: Implement functionality */}
        <SearchInput type="search" placeholder="Search" />
      </LogoContainer>

      <TabList />
    </TopbarContainer>
  );
};

export default Topbar;
