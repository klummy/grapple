import * as React from 'react';

import { ICustomFields } from '../../services/grpc';

export interface IQueryPaneParamsProps {
  fields?: ICustomFields
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

        <div>

          <ul>
            {
              Object.keys(fields).map(key => {
                const field = fields[key]

                return <li key={ field.name }>{ field.name } - { field.type }</li>
              })
            }
          </ul>
        </div>

      </React.Fragment>
    );
  }
}

export default QueryPaneParams;