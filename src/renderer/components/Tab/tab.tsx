import * as React from 'react';

import { CloseIcon, TabItemComponent, TitleComponent } from './tab.components';
import { ITabItemProps } from './tab.types';

const Tab: React.SFC<ITabItemProps> = ({ active, tab, closeTab, renameTab, switchTab }) => {
  const { name, } = tab

  // TODO: Implement tab renaming

  return (
    <TabItemComponent
      active={ active }
      onClick={ () => switchTab(tab) }
    >
      <TitleComponent>
        { name || 'Untitled Request' }
      </TitleComponent>

      <CloseIcon className="ti-close" onClick={ () => closeTab(tab) } />
    </TabItemComponent>
  );
}

export default Tab;