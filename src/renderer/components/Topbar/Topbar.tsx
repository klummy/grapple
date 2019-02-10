import React from "react";

import {
  LogoContainer,
  SearchInput,
  TopbarContainer
} from "./Topbar.components";
import Logo from "../Logo";

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
    </TopbarContainer>
  );
};

export default Topbar;
