import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'

import { IStoreState } from '../../types';
import { ITab } from '../../types/layout';
import QueryPane from '../QueryPane';
import Results from '../Results';

const EmptyStateContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  min-height: 400px;
  padding: 20px;
`

export interface IContentProps {
  activeTab: string
  tabs: Array<ITab>
}

const Content: React.SFC<IContentProps> = ({ activeTab, tabs }) => {
  const tab = tabs.find(t => t.id === activeTab)

  if (!tab) {
    return (
      <EmptyStateContainer>
        Empty
      </EmptyStateContainer>
    )
  }

  return (
    <React.Fragment>
      <QueryPane />
      <Results queryResult={ JSON.stringify(tab.results || {}, null, 2) } />
    </React.Fragment>
  );
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  tabs: state.layout.tabs
})

export default connect(mapStateToProps)(Content);