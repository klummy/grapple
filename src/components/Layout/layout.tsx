import * as React from 'react';

import Sidebar from '../Sidebar';

const Layout: React.SFC<{}> = ({ children }) => {
  return (
    <div>
      <Sidebar />

      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;