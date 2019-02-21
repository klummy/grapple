import * as React from 'react';
import { connect } from 'react-redux';

import * as layoutActions from '../../store/layout/layout.actions';
import { IStoreState } from '../../types';
import { ITab } from '../../types/layout';
import Tab from '../Tab';

import { TabListContainer } from './TabList.components';

export interface ITabListProps {
  activeTab: string;
  closeTab: (tab: ITab) => void;
  updateTab: (tab: ITab) => void;
  switchTab: (tab: ITab) => void;
  tabs: ITab[];
}

const TabList: React.SFC<ITabListProps> = ({
  activeTab,
  closeTab,
  updateTab,
  switchTab,
  tabs,
}) => {
  return (
    <TabListContainer>
      {
        Array.isArray(tabs)
        && tabs.length > 0
        && tabs.map(tab => (
          <Tab
            active={activeTab === tab.id}
            closeTab={closeTab}
            key={tab.id}
            switchTab={() => {
              if (activeTab !== tab.id) {
                switchTab(tab);
              }
            }}
            tab={tab}
            updateTab={updateTab}
          />
        ))
      }
    </TabListContainer>
  );
};

const mapStateToProps = (state: IStoreState) => ({
  activeTab: state.layout.activeTab,
  tabs: state.layout.tabs,
});

const mapDispatchToProps = {
  closeTab: (tab: ITab) => layoutActions.closeTab(tab),
  switchTab: (tab: ITab) => layoutActions.switchTab(tab),
  updateTab: (tab: ITab) => layoutActions.updateTab(tab),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabList);
