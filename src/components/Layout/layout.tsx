import * as React from 'react';

import Sidebar from '../Sidebar';

import { LayoutContainer } from './layout.components';

const Layout: React.SFC<{}> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />

      <main>
        { children }
      </main>
    </LayoutContainer>
  );
}

export default Layout;