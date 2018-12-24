import * as React from 'react';

import { OuterWrapper, TabContainer } from './main.components';

const Main: React.SFC<{}> = () => {
  return (
    <OuterWrapper>
      <TabContainer>
        <span>A</span>
      </TabContainer>
    </OuterWrapper>
  );
}

export default Main;