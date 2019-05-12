import React, { useContext } from 'react';
import * as layoutActions from '../../store/layout/layout.actions';
import { ITab } from '../../types/layout';
import Tab from '../Tab';

import { TabListContainer } from './TabList.components';
import { LayoutContext } from '../../contexts';

const TabList: React.SFC<{}> = () => {
  const {
    dispatch: layoutDispatcher,
    state: {
      activeTab,
      tabs,
    },
  } = useContext(LayoutContext);

  const closeTab = (item: ITab) => layoutDispatcher(layoutActions.closeTab(item));
  const switchTab = (item: ITab) => layoutDispatcher(layoutActions.switchTab(item));
  const updateTab = (item: ITab) => layoutDispatcher(layoutActions.updateTab(item));

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

export default TabList;
