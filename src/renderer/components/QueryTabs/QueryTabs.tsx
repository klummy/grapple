import React, { Fragment, useState } from 'react';

import ParamTab from './Tabs/ParamTab';

import { ICustomFields } from '../../services/grpc';

import { HeaderTabContainer, HeaderItem } from './QueryTabs.component';

export interface IQueryTabProps {
  requestFields?: ICustomFields[]
}

const TABS = {
  credentials: 2,
  params: 1,
};

const QueryTab: React.SFC<IQueryTabProps> = ({ requestFields }) => {
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
      </HeaderTabContainer>


      {
        currentTab === TABS.params
        && <ParamTab requestFields={requestFields} />
      }
    </Fragment>
  );
};

export default QueryTab;
