import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { IStoreState } from '../../types';
import { ITab, INotification } from '../../types/layout';
import QueryPane from '../QueryPane';
import Results from '../Results';

import { EmptyStateContainer, OuterWrapper } from './Content.components';
import NotificationList from '../NotificationList';

export interface IContentProps {
  activeTab: string;
  notifications: INotification[],
  tabs: ITab[];
}

export const Content: React.SFC<IContentProps> = ({ activeTab, notifications, tabs }) => {
  const tab = tabs.find(t => t.id === activeTab);

  const results = tab && tab.results;

  return (
    <OuterWrapper>
      {tab
        ? (
          <Fragment>
            <QueryPane />
            <Results
              inProgress={tab.inProgress}
              meta={tab && tab.meta}
              queryResult={results ? JSON.stringify(tab.results, null, 2) : ''}
            />
          </Fragment>
        )
        : <EmptyStateContainer data-testid="emptyState">Empty</EmptyStateContainer>
      }

      <NotificationList notifications={notifications} />
    </OuterWrapper>
  );
};

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  notifications: state.layout.notifications,
  tabs: state.layout.tabs,
});

export default connect(mapStateToProps)(Content);
