import * as React from 'react';

import QueryPane from '../QueryPane';
import Results from '../Results';

const Content: React.SFC<{}> = () => {
  return (
    <React.Fragment>
      <QueryPane />
      <Results />
    </React.Fragment>
  );
}

export default Content;