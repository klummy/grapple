import protobufjs from 'protobufjs';
import * as React from 'react';

import QueryPaneParamsTab from './QueryPaneParamsTab';

export interface IQueryPaneParamsProps {
  fields: {
    [k: string]: protobufjs.Field
  }
}

export interface IQueryPaneParamsState { }

class QueryPaneParams extends React.Component<IQueryPaneParamsProps, IQueryPaneParamsState> {
  render() {
    const { fields } = this.props

    if (!fields) {
      return null
    }

    return (
      <React.Fragment>

        <QueryPaneParamsTab title='Params'>

          <ul>
            {
              Object.keys(fields).map(key => {
                const field = fields[key]

                return <li key={ field.name }>{ field.name } - { field.type }</li>
              })
            }
          </ul>
        </QueryPaneParamsTab>

        { /* <QueryPaneParamsTab title='Credentials'>
        </QueryPaneParamsTab> */ }

      </React.Fragment>
    );
  }
}

export default QueryPaneParams;