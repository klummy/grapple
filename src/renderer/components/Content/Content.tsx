import React, { Fragment } from 'react';

import logger from '../../libs/logger';

import QueryPane from '../QueryPane';
import Results from '../Results';
import { EmptyStateContainer, OuterWrapper } from './Content.components';
import NotificationList from '../NotificationList';
import { LayoutContext } from '../../contexts';
import { ILayout } from '../../types/layout';

export class Content extends React.Component<{}, {
  isErrored: boolean
}> {
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
    return (
      <LayoutContext.Consumer>
        {({ state: layoutState }) => {
          const { notifications, tabs, activeTab } = layoutState as ILayout;

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
        }}
      </LayoutContext.Consumer>
    );
  }
}

export default Content;
