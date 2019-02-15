import * as React from 'react';
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

const Content: React.SFC<IContentProps> = ({ activeTab, notifications, tabs }) => {
  const tab = tabs.find(t => t.id === activeTab);

  if (!tab) {
    return <EmptyStateContainer>Empty</EmptyStateContainer>;
  }

  const { results } = tab;

  return (
    <OuterWrapper>
      <QueryPane />
      <Results
        queryResult={results ? JSON.stringify(tab.results, null, 2) : ''}
      />
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
