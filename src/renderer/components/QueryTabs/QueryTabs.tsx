import React, { Fragment, useState } from 'react';

import ParamTab from './Tabs/ParamTab';

import { HeaderTabContainer, HeaderItem, TabsContainer } from './QueryTabs.component';
import MetadataTab from './Tabs/MetadataTab';

const TABS = {
  credentials: 2,
  metadata: 3,
  params: 1,
};

const QueryTab: React.SFC<{}> = () => {
  const [currentTab, setCurrentTab] = useState(TABS.params);

  return (
    <Fragment>
      <HeaderTabContainer>
        <HeaderItem
          currentTab={currentTab}
          onClick={() => setCurrentTab(TABS.params)}
          tabID={TABS.params}
          title="Params"
        />

        <HeaderItem
          currentTab={currentTab}
          onClick={() => setCurrentTab(TABS.credentials)}
          tabID={TABS.credentials}
          title="Credentials"
        />

        <HeaderItem
          currentTab={currentTab}
          onClick={() => setCurrentTab(TABS.metadata)}
          tabID={TABS.metadata}
          title="Metadata"
        />
      </HeaderTabContainer>


      <TabsContainer>
        <ParamTab
          visible={currentTab === TABS.params}
        />

        <MetadataTab visible={currentTab === TABS.metadata} />
      </TabsContainer>
    </Fragment>
  );
};

export default QueryTab;
