import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { IStoreState } from '../../types';
import { ITab, INotification } from '../../types/layout';

import logger from '../../libs/logger';

import QueryPane from '../QueryPane';
import Results from '../Results';
import { EmptyStateContainer, OuterWrapper } from './Content.components';
import NotificationList from '../NotificationList';

export interface IContentProps {
  activeTab: string;
  notifications: INotification[],
  tabs: ITab[];
}

export interface IContentState {
  isErrored: boolean
}

export class Content extends React.Component<IContentProps, IContentState> {
  state = {
    // TODO: Implement error views
    // eslint-disable-next-line react/no-unused-state
    isErrored: false,
  }

  static getDerivedStateFromError() {
    return {
      isErrored: true,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error('Uncaught error in <Content />', error, info);
  }

  render() {
    const { notifications, tabs, activeTab } = this.props;

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
  }
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  notifications: state.layout.notifications,
  tabs: state.layout.tabs,
});

export default connect(mapStateToProps)(Content);
