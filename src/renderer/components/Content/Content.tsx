import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'

import { ITab } from 'renderer/types/layout';
import { IStoreState } from '../../types';
import QueryPane from '../QueryPane';
// import Results from '../Results';

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
  const tabExists = tabs.find(tab => tab.id === activeTab)

  if (!tabExists) {
    return (
      <EmptyStateContainer>
        Empty
      </EmptyStateContainer>
    )
  }

  return (
    <React.Fragment>
      <QueryPane />
      { /* <Results /> */}
    </React.Fragment>
  );
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  tabs: state.layout.tabs
})

export default connect(mapStateToProps)(Content);