import * as React from "react";

import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

import { LayoutContainer, MainContainer } from "./layout.components";

const Layout: React.SFC<{}> = ({ children }) => {
  return (
    <>
      <Topbar />
      <LayoutContainer>
        <Sidebar />

        <MainContainer>{children}</MainContainer>
      </LayoutContainer>
    </>
  );
};

export default Layout;
