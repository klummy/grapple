import * as React from 'react';
import { Provider } from 'react-redux';

import store from '@/renderer/store/index';

const MockStore: React.SFC<{}> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default MockStore;
