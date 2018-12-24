import * as React from 'react';

import Sidebar from '../Sidebar';

import { LayoutContainer, MainContainer } from './layout.components';

const Layout: React.SFC<{}> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />

      <MainContainer>
        { children }
      </MainContainer>
    </LayoutContainer>
  );
}

export default Layout;