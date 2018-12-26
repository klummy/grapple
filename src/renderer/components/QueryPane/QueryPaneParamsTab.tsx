import * as React from 'react';

export interface IQueryPaneParamsTabProps {
  title: string
}

const QueryPaneParamsTab: React.SFC<IQueryPaneParamsTabProps> = ({ title, children }) => {
  return (
    <div>
      <h1>{ title }</h1>

      <div>
        { children }
      </div>
    </div>
  );
}

export default QueryPaneParamsTab;