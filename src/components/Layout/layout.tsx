import * as React from 'react';

import styled from 'styled-components';
import Sidebar from '../Sidebar';

const LayoutContainer = styled.div`
  background-color: red;
  display: flex;
  height: 100vh;
  overflow-y: hidden;
`

const MainContainer = styled.div`
  flex: 1;
`

const Layout: React.SFC<{}> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />

      <main>
        {children}
      </main>
    </LayoutContainer>
  );
}

export default Layout;