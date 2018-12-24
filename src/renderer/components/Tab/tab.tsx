import * as React from 'react';

import { CloseIcon, TabItemComponent, TitleComponent } from './tab.components';

import { ITab } from '../../types/layout';

interface ITabItemProps extends ITab {
  closeTab: (tab: ITab) => void
  tab: ITab
}

const Tab: React.SFC<ITabItemProps> = ({ tab, closeTab }) => {
  const { name, } = tab

  return (
    <TabItemComponent>
      <TitleComponent>
        { name || 'Untitled Request Untitled Request Untitled Request' }
      </TitleComponent>

      <CloseIcon className="ti-close" onClick={ () => closeTab(tab) } />
    </TabItemComponent>
  );
}

export default Tab;