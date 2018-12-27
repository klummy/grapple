import * as React from 'react';

import { ICustomFields } from '../../services/grpc';
import QueryParamBuilder from './QueryParamBuilder';

class QueryPaneParams extends React.Component<{
  fields?: Array<ICustomFields>
}, {}> {
  render() {
    const { fields } = this.props

    if (!fields) {
      return null
    }

    return (
      <React.Fragment>
        <QueryParamBuilder fields={ fields } />
      </React.Fragment>
    );
  }
}

export default QueryPaneParams;