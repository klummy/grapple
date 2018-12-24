import * as React from 'react';

import TabList from '../../components/TabList';
import { OuterWrapper } from './main.components';

const Main: React.SFC<{}> = () => {
  return (
    <OuterWrapper>
      <TabList />
    </OuterWrapper>
  );
}

export default Main;