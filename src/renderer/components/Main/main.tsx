import * as React from 'react';
import { connect } from 'react-redux';

import * as layoutActions from '../../store/layout/layout.actions';
import { IStoreState } from '../../types';
import { ITab } from '../../types/layout';

import Tab from '../../components/Tab';
import { OuterWrapper, TabListContainer } from './main.components';

export interface IMainProps {
  activeTab: string
  closeTab: (tab: ITab) => void
  renameTab: (tab: ITab) => void
  switchTab: (tab: ITab) => void
  tabs: Array<ITab>
}

const Main: React.SFC<IMainProps> = ({ activeTab, closeTab, renameTab, switchTab, tabs }) => {
  return (
    <OuterWrapper>
      <TabListContainer>
        {
          Array.isArray(tabs) && tabs.length > 0 &&
          tabs.map((tab =>
            <Tab
              active={ activeTab === tab.id }
              closeTab={ closeTab }
              key={ tab.id }
              renameTab={ renameTab }
              switchTab={ switchTab }
              tab={ tab } />
          ))
        }
      </TabListContainer>
    </OuterWrapper>
  );
}

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  tabs: state.layout.tabs
})

const mapDispatchToProps = {
  closeTab: (tab: ITab) => layoutActions.closeTab(tab),
  renameTab: (tab: ITab) => layoutActions.renameTab(tab),
  switchTab: (tab: ITab) => layoutActions.switchTab(tab)
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);